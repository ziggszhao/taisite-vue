import {queryProjectInfoWithUserIdApi} from "~/api/project/project.js";

export const useProjectStore = defineStore('project', () => {
    let selectProjectId = ref()
    let projectInfoList=ref([])


    // 获取用户信息
    const initProjectId = async () => {
        // 获取用户信息
        const { success,data } = await queryProjectInfoWithUserIdApi()
        if (success) {
            projectInfoList.value = data
            if( projectInfoList.value.length>0) {
                selectProjectId.value =  projectInfoList.value[0].projectId
            }
        }
    }

    return {
        selectProjectId,
        projectInfoList,
        initProjectId
    }
})