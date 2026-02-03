interface GeocodingResult {
  lat: number;
  lng: number;
  formatted_address?: string;
}

interface AddressData {
  cep: string;
  address?: string;
  number?: string;
  city: string;
  state: string;
}

export async function geocodeAddress(address: AddressData): Promise<GeocodingResult> {
  const query = [
    address.address,
    address.number,
    address.city,
    address.state,
    address.cep,
    'Brasil',
  ]
    .filter(Boolean)
    .join(', ');

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          'User-Agent': 'Dockr/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      const fallbackQuery = `${address.city}, ${address.state}, Brasil`;
      const fallbackResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackQuery)}&limit=1`,
        {
          headers: {
            'User-Agent': 'Dockr/1.0',
          },
        }
      );

      const fallbackData = await fallbackResponse.json();

      if (!fallbackData || fallbackData.length === 0) {
        throw new Error('Endereço não encontrado');
      }

      return {
        lat: parseFloat(fallbackData[0].lat),
        lng: parseFloat(fallbackData[0].lon),
        formatted_address: fallbackData[0].display_name,
      };
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      formatted_address: data[0].display_name,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'Dockr/1.0',
        },
      }
    );

    const data = await response.json();
    return data.display_name || '';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return '';
  }
}
