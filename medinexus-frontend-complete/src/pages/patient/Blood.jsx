import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import {
  Button,
  Card,
  Input,
  Page,
  Notice,
} from "../../components/UI";

export default function Blood() {
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const [radiusKm, setRadiusKm] = useState("10");
  const [bloodBanks, setBloodBanks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [err, setErr] = useState("");

  // Get patient's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      setErr("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        setErr(
          "Unable to get your location. Please allow location access and try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  async function findBloodBanks(e) {
    e.preventDefault();

    if (!location) {
      setErr(
        "Your location is required to find nearby blood banks."
      );
      return;
    }

    setLoading(true);
    setSearched(false);
    setErr("");

    try {
      const response = await api.get("/blood-banks/nearby", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radiusInKm: Number(radiusKm),
        },
      });

      setBloodBanks(
        Array.isArray(response.data)
          ? response.data
          : []
      );

      setSearched(true);
    } catch (error) {
      setErr(errorMessage(error));
      setBloodBanks([]);
    } finally {
      setLoading(false);
    }
  }

  function openMap(bloodBank) {
    const latitude =
      bloodBank.latitude ??
      bloodBank.lat;

    const longitude =
      bloodBank.longitude ??
      bloodBank.lng;

    let destination = "";

    if (
      latitude !== undefined &&
      latitude !== null &&
      longitude !== undefined &&
      longitude !== null
    ) {
      destination = `${latitude},${longitude}`;
    } else {
      destination =
        bloodBank.name ||
        "Blood Bank";
    }

    let mapUrl =
      "https://www.google.com/maps/dir/?api=1";

    if (location) {
      mapUrl +=
        `&origin=${encodeURIComponent(
          `${location.latitude},${location.longitude}`
        )}`;
    }

    mapUrl +=
      `&destination=${encodeURIComponent(
        destination
      )}`;

    mapUrl += "&travelmode=driving";

    window.open(
      mapUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <Page
      title="Nearby Blood Banks"
      subtitle="Find blood banks near your current location."
    >
      {err && (
        <div className="mb-5">
          <Notice>{err}</Notice>
        </div>
      )}

      {/* Search Section */}
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Find Nearby Blood Banks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search for blood banks around your current location.
            </p>
          </div>

          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            Blood Banks
          </span>
        </div>

        <form
          onSubmit={findBloodBanks}
          className="mt-5 space-y-4"
        >
          <Input
            label="Search radius (km)"
            type="number"
            min="1"
            max="100"
            value={radiusKm}
            onChange={(e) =>
              setRadiusKm(e.target.value)
            }
          />

          {/* Location */}
          <div className="rounded-xl bg-teal-50 p-4 text-sm text-teal-800">
            {locationLoading ? (
              <div>
                Getting your current location...
              </div>
            ) : location ? (
              <>
                <div className="font-medium">
                  📍 Using your current location
                </div>

                <div className="mt-1 text-xs text-teal-700">
                  {location.latitude.toFixed(5)},{" "}
                  {location.longitude.toFixed(5)}
                </div>
              </>
            ) : (
              <div>
                Location unavailable
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={
              loading ||
              locationLoading ||
              !location
            }
          >
            {loading
              ? "Searching..."
              : "Find Nearby Blood Banks"}
          </Button>
        </form>
      </Card>

      {/* Results */}
      {searched && (
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Nearby Blood Banks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Blood banks found within{" "}
              {radiusKm} km of your location.
            </p>
          </div>

          {bloodBanks.length === 0 ? (
            <Card>
              <div className="py-6 text-center">
                <div className="text-4xl">
                  🩸
                </div>

                <h3 className="mt-3 font-semibold text-slate-800">
                  No blood banks found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try increasing the search radius.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {bloodBanks.map((bloodBank, index) => (
                <Card
                  key={
                    bloodBank.placeId ||
                    `${bloodBank.name}-${index}`
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-800">
                        {bloodBank.name ||
                          "Blood Bank"}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
                        📍{" "}
                        {bloodBank.address ||
                          "Address not available"}
                      </p>

                      {bloodBank.phoneNumber && (
                        <p className="mt-2 text-sm text-slate-600">
                          📞{" "}
                          {bloodBank.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 rounded-xl bg-red-50 px-3 py-2 text-center">
                      <p className="text-sm font-bold text-red-700">
                        {bloodBank.distanceInKm ??
                          "-"}{" "}
                        km
                      </p>

                      <p className="text-xs text-red-500">
                        away
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      onClick={() =>
                        openMap(bloodBank)
                      }
                    >
                      Get Directions
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </Page>
  );
}