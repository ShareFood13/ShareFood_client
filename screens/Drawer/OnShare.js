import { Share } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { cacheDirectory, downloadAsync } from "expo-file-system";


const onShare = async (title, message, url, image) => {
    console.log(title, message, url, image)
    // console.log(image[0])
    const messageAndUrl = message.concat("\n\n").concat(url);
    try {
        url = image[0];
        // console.log({url})
        const uri = await downloadAsync(url, cacheDirectory + "tmp.png");
        console.log({ uri }); // it prints a local image file
        // Share.share({url : uri.uri , message : messageAndUrl });
        const result = await Share.share(
            {
                title,
                url: uri.uri,
                message: messageAndUrl,
            },
            {
                subject: title,
            }
        );
        if (result.action === Share.sharedAction) {
            // Always work with android
            if (result.activityType) {
                // worked
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // run only for ios if share is dismissed
        }
    } catch (error) {
        console.log(error);
    }
};

export default { onShare };