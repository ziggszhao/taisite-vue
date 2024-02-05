import {createGlobalState} from "@vueuse/core";

export const useSelectProjectId = createGlobalState(() =>
    useLocalStorage("selectProjectId", null,
        {
            serializer: {
                read: (v) => v ? parseInt(v) : null,
                write: (v) => v,
            }
        }
    )
)
export const useProjectInfoList = createGlobalState(() =>
    useLocalStorage("projectInfoList", null,
        {
            serializer: {
                read: (v) => v ? JSON.parse(v) : null,
                write: (v) => JSON.stringify(v),
            }
        }
    )
)
