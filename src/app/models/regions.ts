export interface regionsData{
    _id?: string,
    city?: string,
    state?: string,
    urlName?: string,
    location: {
        coordinates: [number, number];
    },
}

