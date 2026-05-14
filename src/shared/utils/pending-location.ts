let _lat: number | null = null;
let _lng: number | null = null;

export function setPendingLocation(lat: number, lng: number) {
  _lat = lat;
  _lng = lng;
}

export function getPendingLocation(): { lat: number; lng: number } | null {
  if (_lat === null || _lng === null) return null;
  const loc = { lat: _lat, lng: _lng };
  _lat = null;
  _lng = null;
  return loc;
}
