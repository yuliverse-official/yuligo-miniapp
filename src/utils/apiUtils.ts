/** 获取接口全部数据*/
export async function getAllTableData(page = 1, pageSize = 100, accumulatedData: any[] = [], fn: Function, fnParams?: any): Promise<any[]> {
    // 获取当前页的数据
    const res = await fn({
        page,
        page_size: pageSize,
        ...(fnParams || {}),
    });

    const total = res?.total;
    const rankingData = res?.data || [];

    // 将当前页的数据追加到已获取的数据中
    const newAccumulatedData = accumulatedData.concat(rankingData);

    // 如果已经获取的数据量小于总数，继续获取下一页的数据
    if (newAccumulatedData.length < total) {
        return getAllTableData(page + 1, pageSize, newAccumulatedData, fn, fnParams);
    }

    // 返回完整的数据
    return newAccumulatedData;
}

/**
 * 循环调用接口，并在每次调用后延迟1秒
 * @param {number} times - 循环次数
 * @param {Function} apiCall - 接口请求的函数
 */
export async function loopApiCalls(times: number, apiCall: Function) {
    for (let i = 0; i < times; i++) {
        // 调用接口
        await apiCall();

        // 延时100
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

}