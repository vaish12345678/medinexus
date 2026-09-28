package com.medinexus.medicine.service;

import com.medinexus.medicine.dto.MedicineOrderRequestDto;
import com.medinexus.medicine.dto.MedicineOrderResponseDto;
import com.medinexus.medicine.dto.OrderItemResponseDto;
import com.medinexus.medicine.dto.OrderMedicineDto;
import com.medinexus.medicine.entity.MedicineOrder;
import com.medinexus.medicine.entity.MedicineOrderStatus;
import com.medinexus.medicine.entity.OrderItem;
import com.medinexus.medicine.repository.MedicineOrderRepository;
import com.medinexus.medicine.repository.OrderItemRepository;

import com.medinexus.prescription.entity.Prescription;
import com.medinexus.prescription.entity.PrescriptionItem;
import com.medinexus.prescription.repository.PrescriptionItemRepository;
import com.medinexus.prescription.repository.PrescriptionRepository;

import com.medinexus.pharmacy.entity.PharmacyInventory;
import com.medinexus.user.entity.PharmacyProfile;
import com.medinexus.pharmacy.repository.PharmacyInventoryRepository;

import com.medinexus.user.entity.*;
import com.medinexus.user.repository.PatientProfileRepository;
import com.medinexus.user.repository.PharmacyProfileRepository;
import com.medinexus.user.repository.UserRepository;

import com.medinexus.notification.entity.NotificationType;
import com.medinexus.notification.service.NotificationService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineOrderService {

    private final MedicineOrderRepository medicineOrderRepository;
    private final OrderItemRepository orderItemRepository;

    private final PatientProfileRepository patientProfileRepository;
    private final PharmacyProfileRepository pharmacyProfileRepository;

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;

    private final PharmacyInventoryRepository pharmacyInventoryRepository;

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public MedicineOrderService(
            MedicineOrderRepository medicineOrderRepository,
            OrderItemRepository orderItemRepository,
            PatientProfileRepository patientProfileRepository,
            PharmacyProfileRepository pharmacyProfileRepository,
            PrescriptionRepository prescriptionRepository,
            PrescriptionItemRepository prescriptionItemRepository,
            PharmacyInventoryRepository pharmacyInventoryRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {

        this.medicineOrderRepository = medicineOrderRepository;
        this.orderItemRepository = orderItemRepository;

        this.patientProfileRepository = patientProfileRepository;
        this.pharmacyProfileRepository = pharmacyProfileRepository;

        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionItemRepository = prescriptionItemRepository;

        this.pharmacyInventoryRepository = pharmacyInventoryRepository;

        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    // ============================================================
    // PATIENT CREATES ORDER
    // ============================================================

    @Transactional
    public MedicineOrderResponseDto createOrder(
            Long patientUserId,
            MedicineOrderRequestDto dto
    ) {

        User user =
                userRepository.findById(patientUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (user.getRole() != Role.PATIENT) {

            throw new RuntimeException(
                    "Only patients can place medicine orders"
            );
        }

        PatientProfile patient =
                patientProfileRepository.findById(patientUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found"
                                )
                        );

        PharmacyProfile pharmacy =
                pharmacyProfileRepository.findById(
                                dto.getPharmacyId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy not found"
                                )
                        );

        if (pharmacy.getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "This pharmacy is not verified"
            );
        }

        Prescription prescription = null;

        if (dto.getPrescriptionId() != null) {

            prescription =
                    prescriptionRepository.findById(
                                    dto.getPrescriptionId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Prescription not found"
                                    )
                            );

            Long prescriptionPatientId =
                    prescription
                            .getConsultation()
                            .getAppointment()
                            .getPatient()
                            .getId();

            if (!prescriptionPatientId.equals(patientUserId)) {

                throw new RuntimeException(
                        "You are not allowed to use this prescription"
                );
            }
        }

        MedicineOrder order =
                new MedicineOrder();

        order.setPatient(patient);
        order.setPharmacy(pharmacy);
        order.setPrescription(prescription);
        order.setStatus(
                MedicineOrderStatus.PLACED
        );

        MedicineOrder savedOrder =
                medicineOrderRepository.save(order);

        if (prescription != null) {

            List<PrescriptionItem> prescriptionItems =
                    prescriptionItemRepository
                            .findByPrescription(prescription);

            if (prescriptionItems.isEmpty()) {

                throw new RuntimeException(
                        "Prescription does not contain any medicines"
                );
            }

            for (PrescriptionItem prescriptionItem :
                    prescriptionItems) {

                addMedicineFromInventory(
                        savedOrder,
                        pharmacy,
                        prescriptionItem
                );
            }
        }

        notificationService.createNotification(
                pharmacy.getUser().getId(),
                "New Medicine Order",
                "A patient has placed a new medicine order at your pharmacy.",
                NotificationType.MEDICINE_ORDER
        );

        return mapToResponseDto(savedOrder);
    }

    // ============================================================
    // ADD MEDICINE FROM PHARMACY INVENTORY
    // ============================================================

    private void addMedicineFromInventory(
            MedicineOrder order,
            PharmacyProfile pharmacy,
            PrescriptionItem prescriptionItem
    ) {

        PharmacyInventory inventory =
                pharmacyInventoryRepository
                        .findByPharmacyAndMedicine(
                                pharmacy,
                                prescriptionItem.getMedicine()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medicine "
                                                + prescriptionItem
                                                .getMedicine()
                                                .getName()
                                                + " is not available in this pharmacy"
                                )
                        );

        if (!Boolean.TRUE.equals(
                inventory.getAvailable()
        )) {

            throw new RuntimeException(
                    "Medicine "
                            + inventory.getMedicine().getName()
                            + " is currently unavailable"
            );
        }

        Integer requiredQuantity =
                prescriptionItem.getQuantity();

        if (requiredQuantity == null || requiredQuantity <= 0) {

            throw new RuntimeException(
                    "Invalid medicine quantity for "
                            + inventory.getMedicine().getName()
            );
        }

        if (inventory.getStockQuantity()
                < requiredQuantity) {

            throw new RuntimeException(
                    "Insufficient stock for medicine "
                            + inventory.getMedicine().getName()
                            + ". Available stock: "
                            + inventory.getStockQuantity()
            );
        }

        OrderItem orderItem =
                new OrderItem();

        orderItem.setOrder(order);

        orderItem.setMedicine(
                inventory.getMedicine()
        );

        orderItem.setQuantity(
                requiredQuantity
        );

        orderItem.setPrice(
                inventory.getPrice()
        );

        orderItemRepository.save(orderItem);

        int remainingStock =
                inventory.getStockQuantity()
                        - requiredQuantity;

        inventory.setStockQuantity(
                remainingStock
        );

        inventory.setAvailable(
                remainingStock > 0
        );

        pharmacyInventoryRepository.save(inventory);
    }

    // ============================================================
    // GET PATIENT ORDERS
    // ============================================================

    @Transactional(readOnly = true)
    public List<MedicineOrderResponseDto> getPatientOrders(
            Long patientUserId
    ) {

        PatientProfile patient =
                patientProfileRepository.findById(patientUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found"
                                )
                        );

        return medicineOrderRepository
                .findByPatient(patient)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET PHARMACY ORDERS
    // ============================================================

    @Transactional(readOnly = true)
    public List<MedicineOrderResponseDto> getPharmacyOrders(
            Long pharmacyUserId
    ) {

        PharmacyProfile pharmacy =
                pharmacyProfileRepository.findById(pharmacyUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy profile not found"
                                )
                        );

        return medicineOrderRepository
                .findByPharmacy(pharmacy)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET ORDER BY ID
    // ============================================================

    @Transactional(readOnly = true)
    public MedicineOrderResponseDto getOrderById(
            Long orderId,
            Long userId,
            Role role
    ) {

        MedicineOrder order =
                getOrder(orderId);

        if (role == Role.ADMIN) {
            return mapToResponseDto(order);
        }

        if (role == Role.PATIENT &&
                !order.getPatient().getId().equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to view this order"
            );
        }

        if (role == Role.PHARMACY &&
                !order.getPharmacy().getId().equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to view this order"
            );
        }

        if (role != Role.ADMIN &&
                role != Role.PATIENT &&
                role != Role.PHARMACY) {

            throw new RuntimeException(
                    "You are not allowed to view this order"
            );
        }

        return mapToResponseDto(order);
    }

    // ============================================================
    // PHARMACY ACCEPTS ORDER
    // ============================================================

    @Transactional
    public MedicineOrderResponseDto acceptOrder(
            Long orderId,
            Long pharmacyUserId
    ) {

        MedicineOrder order =
                getOrder(orderId);

        checkPharmacyAccess(
                order,
                pharmacyUserId
        );

        if (order.getStatus()
                != MedicineOrderStatus.PLACED) {

            throw new RuntimeException(
                    "Only placed orders can be accepted"
            );
        }

        order.setStatus(
                MedicineOrderStatus.ACCEPTED
        );

        MedicineOrder savedOrder =
                medicineOrderRepository.save(order);

        notificationService.createNotification(
                order.getPatient().getId(),
                "Order Accepted",
                "Your medicine order #" + order.getId()
                        + " has been accepted by the pharmacy.",
                NotificationType.MEDICINE_ORDER
        );

        return mapToResponseDto(savedOrder);
    }

    // ============================================================
    // PHARMACY STARTS PROCESSING
    // ============================================================

    @Transactional
    public MedicineOrderResponseDto processOrder(
            Long orderId,
            Long pharmacyUserId
    ) {

        MedicineOrder order =
                getOrder(orderId);

        checkPharmacyAccess(
                order,
                pharmacyUserId
        );

        if (order.getStatus()
                != MedicineOrderStatus.ACCEPTED) {

            throw new RuntimeException(
                    "Only accepted orders can be processed"
            );
        }

        order.setStatus(
                MedicineOrderStatus.PROCESSING
        );

        MedicineOrder savedOrder =
                medicineOrderRepository.save(order);

        notificationService.createNotification(
                order.getPatient().getId(),
                "Order Processing",
                "Your medicine order #" + order.getId()
                        + " is now being prepared.",
                NotificationType.MEDICINE_ORDER
        );

        return mapToResponseDto(savedOrder);
    }

    // ============================================================
    // PHARMACY MARKS ORDER READY
    // ============================================================

    @Transactional
    public MedicineOrderResponseDto markOrderReady(
            Long orderId,
            Long pharmacyUserId
    ) {

        MedicineOrder order =
                getOrder(orderId);

        checkPharmacyAccess(
                order,
                pharmacyUserId
        );

        if (order.getStatus()
                != MedicineOrderStatus.PROCESSING) {

            throw new RuntimeException(
                    "Only processing orders can be marked ready"
            );
        }

        order.setStatus(
                MedicineOrderStatus.READY
        );

        MedicineOrder savedOrder =
                medicineOrderRepository.save(order);

        notificationService.createNotification(
                order.getPatient().getId(),
                "Order Ready",
                "Your medicine order #" + order.getId()
                        + " is ready.",
                NotificationType.MEDICINE_ORDER
        );

        return mapToResponseDto(savedOrder);
    }

    // ============================================================
    // COMPLETE ORDER
    // ============================================================

    @Transactional
    public MedicineOrderResponseDto completeOrder(
            Long orderId,
            Long pharmacyUserId
    ) {

        MedicineOrder order =
                getOrder(orderId);

        checkPharmacyAccess(
                order,
                pharmacyUserId
        );

        if (order.getStatus()
                != MedicineOrderStatus.READY) {

            throw new RuntimeException(
                    "Only ready orders can be completed"
            );
        }

        order.setStatus(
                MedicineOrderStatus.COMPLETED
        );

        MedicineOrder savedOrder =
                medicineOrderRepository.save(order);

        notificationService.createNotification(
                order.getPatient().getId(),
                "Order Completed",
                "Your medicine order #" + order.getId()
                        + " has been completed.",
                NotificationType.MEDICINE_ORDER
        );

        return mapToResponseDto(savedOrder);
    }

    // ============================================================
    // CANCEL ORDER
    // ============================================================

    @Transactional
    public MedicineOrderResponseDto cancelOrder(
            Long orderId,
            Long patientUserId
    ) {

        MedicineOrder order =
                getOrder(orderId);

        if (!order.getPatient()
                .getId()
                .equals(patientUserId)) {

            throw new RuntimeException(
                    "You are not allowed to cancel this order"
            );
        }

        if (order.getStatus()
                == MedicineOrderStatus.COMPLETED) {

            throw new RuntimeException(
                    "Completed order cannot be cancelled"
            );
        }

        if (order.getStatus()
                == MedicineOrderStatus.CANCELLED) {

            throw new RuntimeException(
                    "Order is already cancelled"
            );
        }

        restoreInventoryStock(order);

        order.setStatus(
                MedicineOrderStatus.CANCELLED
        );

        MedicineOrder savedOrder =
                medicineOrderRepository.save(order);

        notificationService.createNotification(
                order.getPharmacy().getUser().getId(),
                "Order Cancelled",
                "Medicine order #" + order.getId()
                        + " has been cancelled by the patient.",
                NotificationType.MEDICINE_ORDER
        );

        return mapToResponseDto(savedOrder);
    }

    // ============================================================
    // RESTORE INVENTORY STOCK
    // ============================================================

    private void restoreInventoryStock(
            MedicineOrder order
    ) {

        List<OrderItem> orderItems =
                orderItemRepository.findByOrder(order);

        for (OrderItem orderItem :
                orderItems) {

            PharmacyInventory inventory =
                    pharmacyInventoryRepository
                            .findByPharmacyAndMedicine(
                                    order.getPharmacy(),
                                    orderItem.getMedicine()
                            )
                            .orElse(null);

            if (inventory == null) {
                continue;
            }

            int restoredStock =
                    inventory.getStockQuantity()
                            + orderItem.getQuantity();

            inventory.setStockQuantity(
                    restoredStock
            );

            inventory.setAvailable(
                    restoredStock > 0
            );

            pharmacyInventoryRepository.save(
                    inventory
            );
        }
    }

    // ============================================================
    // GET ORDER ITEMS
    // ============================================================

    @Transactional(readOnly = true)
    public List<OrderItemResponseDto> getOrderItems(
            Long orderId,
            Long userId,
            Role role
    ) {

        MedicineOrder order =
                getOrder(orderId);

        if (role == Role.PATIENT &&
                !order.getPatient().getId().equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to view these order items"
            );
        }

        if (role == Role.PHARMACY &&
                !order.getPharmacy().getId().equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to view these order items"
            );
        }

        if (role != Role.ADMIN &&
                role != Role.PATIENT &&
                role != Role.PHARMACY) {

            throw new RuntimeException(
                    "You are not allowed to view these order items"
            );
        }

        return orderItemRepository
                .findByOrder(order)
                .stream()
                .map(this::mapOrderItemToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // HELPER - GET ORDER
    // ============================================================

    private MedicineOrder getOrder(
            Long orderId
    ) {

        return medicineOrderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medicine order not found"
                        )
                );
    }

    // ============================================================
    // HELPER - CHECK PHARMACY ACCESS
    // ============================================================

    private void checkPharmacyAccess(
            MedicineOrder order,
            Long pharmacyUserId
    ) {

        if (!order.getPharmacy()
                .getId()
                .equals(pharmacyUserId)) {

            throw new RuntimeException(
                    "You are not allowed to manage this order"
            );
        }
    }

    // ============================================================
    // MAP ORDER TO RESPONSE
    // ============================================================

    private MedicineOrderResponseDto mapToResponseDto(
            MedicineOrder order
    ) {

        Long prescriptionId = null;
        String prescriptionNotes = null;

        List<OrderMedicineDto> medicines = new java.util.ArrayList<>();

        if (order.getPrescription() != null) {

            prescriptionId =
                    order.getPrescription().getId();

            prescriptionNotes =
                    order.getPrescription().getNotes();

            List<PrescriptionItem> prescriptionItems =
                    prescriptionItemRepository
                            .findByPrescription(
                                    order.getPrescription()
                            );

            for (PrescriptionItem item : prescriptionItems) {

                String medicineName = null;

                if (item.getMedicine() != null) {
                    medicineName =
                            item.getMedicine().getName();
                }

                medicines.add(
                        OrderMedicineDto.builder()
                                .medicineId(
                                        item.getMedicine() != null
                                                ? item.getMedicine().getId()
                                                : null
                                )
                                .medicineName(medicineName)
                                .quantity(item.getQuantity())
                                .dosage(item.getDosage())
                                .frequency(item.getFrequency())
                                .duration(item.getDuration())
                                .instructions(item.getInstructions())
                                .build()
                );
            }
        }

        return MedicineOrderResponseDto.builder()

                .id(order.getId())

                .patientId(
                        order.getPatient().getId()
                )

                .pharmacyId(
                        order.getPharmacy().getId()
                )

                .prescriptionId(prescriptionId)

                .patientName(
                        order.getPatient()
                                .getUser()
                                .getName()
                )

                .patientPhone(
                        order.getPatient()
                                .getUser()
                                .getPhone()
                )

                .patientAddress(
                        order.getPatient()
                                .getAddress()
                )

                .prescriptionNotes(
                        prescriptionNotes
                )

                .status(
                        order.getStatus()
                )

                .createdAt(
                        order.getCreatedAt()
                )

                .updatedAt(
                        order.getUpdatedAt()
                )

                .medicines(medicines)

                .build();
    }

    // ============================================================
    // MAP ORDER ITEM TO RESPONSE
    // ============================================================

    private OrderItemResponseDto mapOrderItemToResponse(
            OrderItem item
    ) {

        return OrderItemResponseDto.builder()
                .id(item.getId())
                .orderId(item.getOrder().getId())
                .medicineId(item.getMedicine().getId())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build();
    }
}