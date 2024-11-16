// import { Api, TelegramClient } from "telegram";
// import { StringSession } from "telegram/sessions";
// // import input from "input"; // 一个用于获取用户输入的库
// @ts-ignore
import { request } from "umi";
import { TOAST_TYPE } from "@/components/NewToast";

// const apiId = 123456; // 替换为你的API ID
// const apiHash = "YOUR_API_HASH"; // 替换为你的API Hash
// const stringSession = new StringSession(""); // 你应该在这里放置你的字符串会话

// const client = new TelegramClient(stringSession, apiId, apiHash, {});

// (async () => {
//     console.log("Loading interactive example...");
//     // await client.start({
//     //     phoneNumber: async () => await input.text("Please enter your number: "),
//     //     password: async () => await input.text("Please enter your password: "),
//     //     phoneCode: async () => await input.text("Please enter the code you received: "),
//     //     onError: (err) => console.log(err),
//     // });
//     console.log("You should now be connected.");

//     // // 请求用户位置
//     // const sendLocationRequest = async (chatId) => {
//     //     const result = await client.invoke(
//     //         new Api.messages.SendMessage({
//     //             peer: chatId,
//     //             message: "Please share your location:",
//     //             replyMarkup: new Api.ReplyKeyboardMarkup({
//     //                 rows: [
//     //                     [
//     //                         new Api.KeyboardButton({
//     //                             text: "Share Location",
//     //                             requestLocation: true,
//     //                         }),
//     //                     ],
//     //                 ],
//     //                 resize: true,
//     //                 singleUse: true,
//     //             }),
//     //         })
//     //     );
//     //     console.log(result); // 打印结果
//     // };

//     // // 处理收到的位置消息
//     // client.addEventHandler(async (event) => {
//     //     if (event.message && event.message.geo) {
//     //         const latitude = event.message.geo.lat;
//     //         const longitude = event.message.geo.long;
//     //         console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
//     //         await client.sendMessage(event.message.peerId, {
//     //             message: `Latitude: ${latitude}, Longitude: ${longitude}`,
//     //         });
//     //     }
//     // }, new Api.UpdateNewMessage());

//     // 替换为目标聊天 ID 或用户名
//     const chatId = "TARGET_CHAT_ID_OR_USERNAME";
//     // await sendLocationRequest(chatId);
// })();
export interface LocationDataType {
    longitude: string | number;
    latitude: string | number;
    region_name?: string;
}

export const getUserLocation = () => {
    return new Promise<LocationDataType | null>((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    resolve({
                        latitude,
                        longitude,
                    })
                },
                (error) => {
                    // window.ShowToast(`Error getting location: ${error.message}`, TOAST_TYPE.Warn, 3000);
                    reject(null);
                }
            );
        } else {
            // window.ShowToast("Geolocation is not supported by this browser.", TOAST_TYPE.Warn, 3000);
            reject(null);
        }
    })
}


interface getTextAddressRes {
    "address": {
        "road": string,
        "residential": string,
        "suburb": string,
        "city": string,
        "state": string,
        "ISO3166-2-lvl4"?: string,
        "ISO3166-2-lvl3"?: string,
        "postcode": string,
        "country": string,
        "country_code": string
    },
}
/**
 * 根据经纬度获取逆向地址
 */
export async function getTextAddressByParams(lat: string, lon: string): Promise<getTextAddressRes> {
  return request(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&zoom=5`, {
    method: "GET",
    headers: {
      'Accept-Language': 'en-US',  // 固定返回语种
    },
  });
}

export function LocationRegionNameConvert(result: any) {
    let region = result.address.country;
    let name = result.name;
    if (region === "China") {
      if (name === "Hong Kong" || name === "Macau") {
        region = result.address.state;
      } else {
        region = "Mainland China";
      }
    }
    return region;
  }