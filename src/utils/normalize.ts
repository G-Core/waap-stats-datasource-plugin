export enum SizeUnitEnum {
    Bytes = 'Bytes',
    KBytes = 'KBytes',
    MBytes = 'MBytes',
    GBytes = 'GBytes',
}

export const normalizeBytes = (
    bytes: number,
    unit: SizeUnitEnum,
    precision = 2
): number => {
    switch (unit) {
        case SizeUnitEnum.Bytes:
            return Number(bytes.toFixed(precision));
        case SizeUnitEnum.KBytes:
            return Number((bytes / 1024).toFixed(precision));
        case SizeUnitEnum.MBytes:
            return Number((bytes / (1024 * 1024)).toFixed(precision));
        case SizeUnitEnum.GBytes:
            return Number((bytes / (1024 * 1024 * 1024)).toFixed(precision));
    }
};
