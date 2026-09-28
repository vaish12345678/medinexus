
import { useEffect, useState } from "react";
import {
  Ambulance,
  ArrowRight,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  Siren,
} from "lucide-react";
import api, { errorMessage } from "../../services/api";
import { Button, Card, Input, Notice, Page } from "../../components/UI";

export default function Ambulances() {
  const [location, setLocation] = useState({
    latitude: 18.5204,
    longitude: 73.8567,
  });

  const [radius, setRadius] = useState("5");
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationMessage, setLocationMessage] = useState("");

  // Get patient's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      setLocationMessage(
        "Location access is not supported. Showing results around Pune."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationLoading(false);
        setLocationMessage("Using your current location.");
      },
      () => {
        setLocationLoading(false);
        setLocationMessage(
          "Location permission was not available. Showing results around Pune."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  async function searchAmbulances() {
    setErr("");
    setLoading(true);

    try {
      const radiusValue = Number(radius);

      if (!radiusValue || radiusValue <= 0) {
        setErr("Please enter a valid radius.");
        setLoading(false);
        return;
      }

      const response = await api.get("/ambulances/nearby", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radiusInKm: radiusValue,
        },
      });

      setData(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      setErr(errorMessage(e));
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  function formatDistance(distance) {
    if (distance === null || distance === undefined) {
      return "Distance unavailable";
    }

    return `${Number(distance).toFixed(2)} km away`;
  }

  function handleDirections(mapsUrl) {
    if (!mapsUrl) {
      return;
    }

    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Page
      title="Nearby Ambulances"
      subtitle="Find nearby ambulance services using your current location."
    >
     
      {/* Location + Search */}
      <Card>
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50">
            <LocateFixed className="text-teal-600" size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Find Nearby Ambulances
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              We use your current location to find ambulance services near
              you.
            </p>
          </div>
        </div>

        {/* Location Status */}
        {locationMessage && (
          <div
            className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 ${
              locationLoading
                ? "border-slate-200 bg-slate-50 text-slate-600"
                : "border-teal-100 bg-teal-50 text-teal-800"
            }`}
          >
            <MapPin
              size={18}
              className={`mt-0.5 shrink-0 ${
                locationLoading ? "text-slate-500" : "text-teal-600"
              }`}
            />

            <div>
              <p className="text-sm font-semibold">
                {locationLoading
                  ? "Detecting your location..."
                  : "Location status"}
              </p>

              <p className="mt-0.5 text-xs opacity-80">
                {locationMessage}
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <Input
            label="Search Radius (km)"
            type="number"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />

          <Button
            type="button"
            onClick={searchAmbulances}
            disabled={loading || locationLoading}
          >
            <span className="flex items-center justify-center gap-2">
              <Search size={17} />
              {loading ? "Searching..." : "Find Ambulances"}
            </span>
          </Button>
        </div>

        {/* Coordinates */}
        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <MapPin size={14} className="text-slate-400" />

          <span>
            Current coordinates:{" "}
            <span className="font-medium text-slate-700">
              {location.latitude.toFixed(5)},{" "}
              {location.longitude.toFixed(5)}
            </span>
          </span>
        </div>
      </Card>

      {/* Error */}
      {err && <Notice>{err}</Notice>}

      {/* Empty State */}
      {!loading && data.length === 0 && !err && (
        <Card>
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Ambulance className="text-slate-500" size={32} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No ambulances found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find any ambulance services within your selected
              radius. Try increasing the search radius and search again.
            </p>
          </div>
        </Card>
      )}

      {/* Ambulance Results */}
      {data.length > 0 && (
        <div>
          {/* Results Header */}
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                Emergency Services
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Nearby Ambulances
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {data.length} ambulance service
                {data.length !== 1 ? "s" : ""} found within {radius} km
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
              <MapPin size={14} />
              {radius} km radius
            </div>
          </div>

          {/* Ambulance Cards */}
          <div className="grid gap-5 md:grid-cols-2">
            {data.map((ambulance, index) => (
              <Card
                key={ambulance.placeId || index}
                className="group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100">
                      <Ambulance
                        className="text-teal-700"
                        size={29}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-slate-900">
                        {ambulance.name || "Ambulance Service"}
                      </h3>

                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                        <Navigation size={13} />
                        {formatDistance(ambulance.distanceInKm)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                      <MapPin
                        size={16}
                        className="text-teal-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-700">
                        {ambulance.address ||
                          "Address information unavailable"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Phone
                        size={16}
                        className="text-teal-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Contact
                      </p>

                      {ambulance.phoneNumber ? (
                        <a
                          href={`tel:${ambulance.phoneNumber}`}
                          className="mt-1 block text-sm font-semibold text-teal-700 transition hover:text-teal-800 hover:underline"
                        >
                          {ambulance.phoneNumber}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-slate-500">
                          Phone number unavailable
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {ambulance.phoneNumber && (
                    <a
                      href={`tel:${ambulance.phoneNumber}`}
                      className="inline-flex min-h-[45px] flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 hover:shadow-md"
                    >
                      <Phone size={17} />
                      Call Ambulance
                    </a>
                  )}

                  {ambulance.mapsUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDirections(ambulance.mapsUrl)
                      }
                      className="inline-flex min-h-[45px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                    >
                      <Navigation size={17} />
                      Directions
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Page>
  );
}

