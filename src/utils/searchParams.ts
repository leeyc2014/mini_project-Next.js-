export const setSingleParam = (
    params: URLSearchParams,
    key: string,
    value: FormDataEntryValue | null
) => {
    if (typeof value === 'string' && value !== '') {
        params.set(key, value);
    } else {
        params.delete(key);
    }
};

export const setMultiParam = (
    params: URLSearchParams,
    key: string,
    values: FormDataEntryValue[]
) => {
    params.delete(key);
    values.forEach(v => {
        if (typeof v === 'string') {
            params.append(key, v);
        }
    });
};

export const setCheckParam = (
    params: URLSearchParams,
    key: string,
    value: FormDataEntryValue | null
) => {
    if (value) {
        params.set(key, '1');
    } else {
        params.delete(key);
    }
};
