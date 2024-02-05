import {createGlobalState} from "@vueuse/core";

export const useTourHistory = createGlobalState(() =>
    useLocalStorage("tour-history", [],
        {
            serializer: {
                read: (v) => v ? JSON.parse(v) : [],
                write: (v) => JSON.stringify(v),
            }
        }
    )
)
