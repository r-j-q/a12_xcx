let ajaxTime = 0;
export const baseUrl = "https://www.star1.vip/dev/api"
// export const baseUrl = "https://www.star1.vip/ball/api"
export const request = (params, isTrue) => {
    let header = {
        ...params.header
    };
    ajaxTime++;
    if (!isTrue) {
        wx.showLoading({
            title: "加载中",
            mask: true,
        });
    }
    header["Authorization"] = wx.getStorageSync('token') || ''
    const content_type = params.contentType ? params.contentType : "application/x-www-form-urlencoded";
    header["content-type"] = content_type;
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            method: params.method,
            timeout: 10000,
            success: (result) => {
                // console.log(result, '1111111')
                if (result.data && result.data.code == 200) {
                    resolve(result.data);
                } else if (result.data.code == 401) {
                    wx.removeStorageSync('name')
                    wx.removeStorageSync('portrait')
                    wx.removeStorageSync('token')
                    wx.removeStorageSync('mobile')
                    wx.removeStorageSync('member_id')
                    resolve(result.data);
                    wx.navigateTo({
                        url: '/pages/login/index',
                    })

                } else if (result.data.code == 402) {
                    resolve(result.data);
                    wx.navigateTo({
                        url: '/pages/personal/index',
                    })
                }

                // else if (result.data.code == 403) {
                //     resolve(result.data);
                //     wx.navigateTo({
                //         url: '/pages/authentication/index',
                //     })
                // }

                else {
                    resolve({
                        "code": 500
                    });
                    setTimeout(() => {
                        wx.showToast({
                            title: result.data.msg || '服务器繁忙，请稍后再试',
                            icon: 'none',
                            duration: 3000
                        });
                    }, 500);
                }
            },
            fail: (err) => {
                console.log(err)
                resolve({
                    "code": 500
                });
                reject(err);
                setTimeout(() => {
                    wx.showToast({
                        title: '服务器繁忙，请稍后再试',
                        icon: 'none',
                        duration: 3000
                    })
                }, 500);
            },
            complete: () => {
                ajaxTime--;
                if (ajaxTime === 0) {
                    wx.hideLoading();
                }
            }
        });
    })
}