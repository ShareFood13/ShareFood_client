// import React from 'react'
// import { View, Text, Button, StyleSheet } from 'react-native'

// export default function Share({ navigation }) {
//     return (
//         <View style={styles.container}>
//             <Text>Share</Text>
//             <Button title='Click Me' onPress={() => alert('ToDo')} />
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     }
// })

import React, { useState } from 'react';
import { View, Text, Button, Share, Image, TouchableOpacity, StyleSheet } from 'react-native'; //, Share
import * as Sharing from "expo-sharing";
import * as FileSystem from 'expo-file-system';
import logo from '../../assets/b64/data';
import Banner from '../../components/Banner';


// const logoUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3"><g fill="#61DAFB"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z" /><circle cx="420.9" cy="296.5" r="45.7" /><path d="M520.5 78.1z" /></g></svg>`;

// const image_source = "data:image/png;base64,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"

const image_source = 'https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80';
// const image_source = "../../assets/logo.png"
// const image_source = logo

// import Share2 from "react-native-share"


const SharePage = () => {
    const messageText = 'Text that you want to share goes here';
    const options = {
        // mimeType: 'image/jpeg',
        dialogTitle: messageText,
    };

    const share = () => {
        FileSystem.downloadAsync(
            image_source,
            FileSystem.documentDirectory + '.jpeg'
        )
            .then(({ uri }) => {
                console.log('Finished downloading to ', uri);

                Sharing.shareAsync(uri, options);
            })
            .catch(error => {
                console.error(error);
            });
    }

    // const openShareDialogAsync = async (mediaProp, options) => {
    //     const fileDetails = {
    //         extension: options.video ? '.mp4' : '.jpg',
    //         shareOptions: {
    //             mimeType: options.video ? 'video/mp4' : 'image/jpeg',
    //             dialosTitle: options.video
    //                 ? 'Check out this video!'
    //                 : 'Check out this image!',
    //             UTI: options.video ? 'video/mp4' : 'image/jpeg',
    //         },
    //     };
    //     const downloadPath = `${FileSystem.cacheDirectory}${mediaProp.media_id}${fileDetails.extension}`;
    //     const { uri: localUrl } = await FileSystem.downloadAsync(
    //         mediaProp.url,
    //         downloadPath
    //     );
    //     if (!(await Sharing.isAvailableAsync())) {
    //         showMessage({
    //             message: 'Sharing is not available',
    //             description: 'Your device does not allow sharing',
    //             type: 'danger',
    //         });
    //         return;
    //     }
    //     await Sharing.shareAsync(localUrl, fileDetails.shareOptions);
    // };

    // const onShare = async () => {
    //     try {
    //         const result = await Share.share({
    //             message:
    //                 "React Native | A framework for building native apps using React",
    //             url:
    //                 "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABQCAYAAAAujppDAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TtSIVQTuICGaoThZERRy1CkWoEGqFVh1MXvojNGlIUlwcBdeCgz+LVQcXZ10dXAVB8AfEzc1J0UVKvC8ptIjxwuN9nHfP4b37AKFWYprVNgZoum2mEnExk10RQ6/oQAC9CGNIZpYxK0lJ+NbXPfVS3cV4ln/fn9Wt5iwGBETiGWaYNvE68dSmbXDeJ46woqwSnxOPmnRB4keuKx6/cS64LPDMiJlOzRFHiMVCCystzIqmRjxJHFU1nfKFjMcq5y3OWqnCGvfkLwzn9OUlrtMaRAILWIQEEQoq2EAJNmK066RYSNF53Mc/4Polcink2gAjxzzK0CC7fvA/+D1bKz8x7iWF40D7i+N8DAOhXaBedZzvY8epnwDBZ+BKb/rLNWD6k/RqU4seAT3bwMV1U1P2gMsdoP/JkE3ZlYK0hHweeD+jb8oCfbdA16o3t8Y5Th+ANM0qeQMcHAIjBcpe83l3Z+vc/u1pzO8HFnByggUR1VMAAAAGYktHRAABAAEAAbLmyG4AAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBgESLxykHqFoAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAADq1JREFUeNrtnX9Q1FW/x1/L8ks0U0FRftklRRTix+0aKo+i3qv4A8tSfKSaW0rZFKNTtybv2DM9ZVlJNda9kwq3X+QIjtVjk4+Zoj3x09+koGUI5uKDIgi2GyC47H7uH/v9Opsa7vJjd9F9z5wZFtjzPefz/p7P+ZzP+ZzP0XDrYTCwEJgIxCjFGkZgB1ABlAJ7+3qHNbcQecHAS8B/Av0BQkNDSUlJITY2Fl9fX6qqqjh58iRffPGF+h0TcBxYC+ThhtPgATwK1AESGBgoK1eulJKSEtHr9WIymUSFyWSStrY2qa2tlZycHJk9e7YAopD5NyDMLU7naJJXALNGo5HHHntMTpw48TviOoPBYJC8vDwZNGiQSuYvwBi3WB1L4KuAGZCsrCz57bffpCv48ccfrUflaSDSLV7H4GGVwA8//FCMRqN0BzqdzprIQ8DAa543EFgArAOKgKZryhkgG1gCjHPTc3OMAM4Csn79+m4TaE3klClTVCJXWxlM64B65fcyatQoeeihhyQzM1PeffddeeKJJyQpKUn9ngCtitU72U3VH+N/AElLS+uyCv0j7N69WyWiGVgGnAPE399fnn76aSksLJSGhgZpb2+/+h2j0SgGg0EqKyvlzTfflLi4OLWONmD9DUb1bYlgIAlYDmQAl4YMGSLl5eXS0zAajbJ69WrrUSWpqalSXl4uHR0dNtVx4cIFeeedd8TT01Ot4yAw7HYkbogyEg4DLer8p5ZnnnnGZivUXpSVlYmXl5cAsnHjRtHr9XbXYTabpaioSKKjo9U2H7idiNQCaUCjSlhycrJkZmZKQUGBnDlzRvR6vTQ3N0tvwWg0SnFxsRw4cKDb821FRYXExsaqRP4d8L7VCRwIbFcW37Jo0SI5dOiQGAwG6csoLy+X0aNHq0Sm9zVPSgAQAYy2KuHKaNPcgMC9gISEhEhubm6PGy3Ogtlslry8PJXEOkUuLgsvIBHYAPwE6K3nMaV0ADrFzfWY4rD2VAkMDw+X/fv3y62G1tZWWbZsmSqDNFd0gHsA04D3lIWuR0REBImJiURHRxMbG4uPjw8//fQT1dXV7Nu3j8LCQpQONSrGy6zRo0ezadMmEhISbsm5ori4mMmTJwNcBD5XnAoHgRPObtsAxVPRBsj06dMlNzdXzp8/L1euXLnujezo6BCDwSDFxcWyZMkS6d+/vwCi1Wplx44dDh8hbW1t8ssvv/yu1NbW9sqzDAaDpKenS2JiorVmugwUAzOVweAUAncDMnDgQHn//felsbHR5k5duXJF9u7dK48//ri89tprPeZ5sQc1NTXXqntZsWKFmM3mXnlee3u76PV6qayslLVr10pCQoL6XDOwRZleHGpJ7lK3f4qKinpt3eZoEp999tleI/FaXLx4UbKysiQkJMQpOylrAQkODpaSkpI+a3A4m0TVeq2oqJA5c+aobTijWPW9iilAm1arlYKCgj5tNboCidZtmTFjhtqOKmW6ssmq7IpF+1fA56WXXmLSpEluz24PITQ0lI8//pikpCSAu612UnqcxAjgTxMnTmT58uV4enq6pd+DCAkJ4e2331bl+ixwb2+Q+CDgvXDhQvz9/d1S7wXEx8fz+uuvq1ovvTdInAIwf/58NBqNW+K9AE9PTx5++GH142LApydJ9AWi58yZQ3BwsFvavYigoCBeeOEFlHVjYk+SqAWGREVF4eXl5ZZ0b+7HabWqgQMQ19PqlLi4ODw8PNyS7mWMGjVK/XFMj5MoIm4JO8hSHTRoUI8vMfoBHuXl5ZjNZreUexl+fn7qtBWKZZuv2yRqgDeAfiaTyS1hB1qqwGxgI5Z9126ROA9Y6uvry4IFC9zLCwdAo9Gwfv16/Pz8AJZi2fLTdpVEP2ANoF2zZg0JCQluEh1E4vz589m8eTM+Pj5giS7/r66SOBEYm5ycTHp6utsydTAeeOABPvvsM/XjC1xzVsRWNv4MaJctW8add97plqoTRuT9999PRkYGWGJX/4pVaI2tJM6Oi4sjMTHRLVEnwdfXl+eff57BgwcD/AcwyB4SQ4FhSUlJBAQEuKXpRNx1112sWLECLCGPafaQGA54RUZGotVq3ZJ0AbWqGDn/fnUZYmsF99xzj8t2zmw209zcjE6n4+LFi5w+ffq6//H29iYyMpKAgACGDx+Or69vn7Sww8LCCAkJobq6+l8U/jpsJtEVN3+bmpooKytjx44dfPPNN1RWVto2wc+eTWJiInPmzOlzhlpAQABhYWFUV1cPU0m05XtJgDkvL89l4mIuX74seXl5MmHChOviY+wtycnJLhNjYytycnIE+CeWrUGb1GkLYD59+rRWRJyugs6cOcOLL77I559/3iP17dq1q8+p1Gu1oi0kHgHa9+/f79fe3o6vr6/TGl9RUcHChQttVpu3KnJzc+322Aiwe/v27ZSVlTmt4Q0NDbz66qu3PYF6vV413JqxRI3bvNjfBci2bducsgUlImzdupUvv/zytl9mnD17Fp1OB5ZTZ1fsIXE70Lpx40aKi4sd3nCDwUB2dvZtT6CIkJ+fT2trK0BhV+pYDZjj4uJ+lznCETh27Fi3rVB7yowZM+Ty5csuZ5WeP39egoODBfgNSzIK7BmJYDlHZz579qzDwzMaGxsd+rz8/HxcbeO7o6ODDRs2UFtbC/AP4Ly9JCYDuYB28eLFbvebE1BYWMjq1avBkujoLdWosRV3Ab8CkpGRIb/++qvD1ch3333nUHUK9Gp2DntRXFxsffRttb0vgAfwFSBLlizpUj6XnkBVVZVDCVy8ePENTzk7Gh0dHVJUVCTDhg1T2/YtSi5XezAPkMGDB8upU6ec1pmWlhaZN2+ew0jMzs52iRG4e/duCQoKUtu1kz846tbZnKjBkt2C9957j7vvvttp84Gfnx9PPvmkQ54VERFBSkqKS6wompubjefOnVM/19CFRBnDgBYvLy9pampy+lvZ3t4ur7zySq+Pwu+//95l5sILFy7IG2+8IQMGDFDbdwI7TxCnALJu3TqX8eg3NDTI8uXLe4W88PBw+eSTT5yS/OFmySn27dsn06ZNU9tabQ+Rqzw8PFzqzVRH5EcffWQ92Xe7zJ07V0pKSlx6+0mn08nMmTOtsyMPsYXErAEDBkhVVZVLptk6deqUvPzyyxITE9Mtz8ynn37qNKu7K0ROnz5dbX+OatN0NlFmxcTELDt06BDe3q6ZGNBkMtHU1MThw4cpKCigtLSU2traG4Zn3HHHHYSGhjJ27FgmT57M+PHjiYmJYcCAAfQl/PDDD0ybNg29Xm9WprydnZIYHx+/7PDhw30mWLi1tZWWlhbq6+uv+5tWqyU4OBgfHx+XfSltRXZ2Nk899RRYUm/O61SdDh8+XM6ePStuuBbq6+vl3nvvFaAdGNfZEGttbGykrq7O7bh0MQwdOpTU1FSwJMD9U2ck7jMajfz8889uqbkgrBwSYzsjsQwwZWVlYTQa3VJzMQQFBREVFQUwqTMSa4CDRUVFam5SN1wI/fv3Jz4+/qa+0ytYUjfy1ltvodfr3ZJzIXh7exMUFHRTEgE+Bk7t2bOHrKws3Me8XQcdHR1XIx5uRmIz8BTQsXLlSjZt2uQm0kVw+fJljhw5YhOJYInneBeQpUuXsmnTJnfmDBfAuXPnOHr0KEC5rcEye7CkP0ncvn27prW1lTFjxth1GKWhoYGKigrq6uoIDAx0HxnvJvLy8ti5cydYfKg2wwP4b0XFSmRkpOTl5YlOp/tD77/ZbJba2lr5+uuvZfz48QKIt7e3bN682eZ7l9y4HpcuXVKTwRuBf+3K6Zh7sORUmQB4DB48mLS0NJKSkggJCcHf3x+DwYBOp6OkpMT6yJlguQ9jpIeHhyYnJ4e0tLQuR84ZjUZEpM/7QbuC3NxcHnnkEbBk8Z/SnbqmA/8H/IxyLdANiglLYvJNWBLq+ACZ6t/Xrl0r9fX1dm+SFhYWyqxZsyQ8PFxqampuq1FYWVlpHXezoKdeDE/AH0gFFlmVPwOBXH/ySgu8qarlKVOmSH5+/k1DQNrb26WyslLWrFkjGo3m6ouyZs0al1XNJpNJzp07Z/eL2lm4xqOPPqr2fQc3SEzkSGgUNXAcEA8PD4mNjZUPPvhASktLpbq6WpqamqSurk6OHz8u27Ztk/T0dPH397e+KTRHmRPkwIEDLkliaWmphIWFSXx8vBw9erTbOxdpaWlq/+uVAeIS8MNyN/D3gEEdXQEBARIdHW1905koHiQdlqthRymG1jqUHXpX2zIrLy+XqKioq+0fO3as5Ofn2x3PajKZ5OTJk5KammpN4H2uOFdrgeFYMuz+Bcu162p5FUsK5RiuT6N8B3AKkFmzZnV7ftTr9ZKfny979uzpVgT4sWPHrMNGfsByUNes1Wpl1apVUl1dfdN4HrPZLE1NTZKdnS2hoaFqXRdclcDuIhLLZSAya9Ysqaio6JLga2pqJCMj4+rIWbBggRw/ftzuIOctW7bI0KFDra+hDcBytv4vKPdpDRw4UJ577jkpKCgQnU539YrBtrY2OX/+vBw8eFAyMzMlIiLCWhNtdSUV2huIUFStBAcHy4YNG2y+s6qlpUW++uora9VnUOsaMWKErFu3TqqqqjpVg01NTVJSUiIPPvigtdH1d8Xgs0aU4o++YD113HfffZKSkiJTp06V4cOHW9fRgiV0P7kz79qtlCpxKPC/ipXsMWHCBBYtWkRKSgqBgYH069cPLy8vTCYTbW1tNDQ0UFBQwJYtW/j222/VOvYBj2O5Gi8bmAv4BgQEMHXqVGbOnMmYMWMYOXIkbW1tVFdXs3fvXg4ePGh9+PafilNkq2J43QhDsOT1Hg/MuAEPZcooLgQauMkJqFst36VGWY+uAv5NnUMnTZrEuHHjGDFiBJcuXaKiooKCggL1OybgpOIfzsUSt6J6qEZhuZx6LjBSUYvXysyoLJeOYrn8Mx/LKTKHdvpWRQwwWfEwTb5BX48AFcrbfkghs7O18EAg4Zp1r0aZj3VYbm11Cv4f1bXvx5hdNN8AAAAASUVORK5CYII="
    //         });
    //         if (result.action === Share.sharedAction) {
    //             if (result.activityType) {
    //                 // shared with activity type of result.activityType
    //             } else {
    //                 // shared
    //             }
    //         } else if (result.action === Share.dismissedAction) {
    //             // dismissed
    //         }
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // };



    // const [result, setResult] = useState("")

    // function getErrorString(error, defaultValue) {
    //     let e = defaultValue || 'Something went wrong. Please try again';
    //     if (typeof error === 'string') {
    //         e = error;
    //     } else if (error && error.message) {
    //         e = error.message;
    //     } else if (error && error.props) {
    //         e = error.props;
    //     }
    //     return e;
    // }

    // const shareMessage = 'Check out this cool app!'
    // const shareOptions = {
    //     title: 'Share via',
    //     message: shareMessage,
    // };

    // const onShare = async () => {
    //     try {
    //         const result = await Share.share(shareOptions);
    //         if (result.action === Share.sharedAction) {
    //             if (result.activityType) {
    //                 // Shared with activity type of result.activityType
    //             } else {
    //                 // Shared
    //             }
    //         } else if (result.action === Share.dismissedAction) {
    //             // Dismissed
    //         }
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // };

    // const shareMultipleImages = async () => {
    //     const shareOptions = {
    //         title: 'Share file',
    //         // message: "first test",
    //         failOnCancel: false,
    //         //   urls: [images.image1, images.image2],
    //     };

    //     // If you want, you can use a try catch, to parse
    //     // the share response. If the user cancels, etc.
    //     try {
    //         const ShareResponse = await Share2.open(shareOptions);
    //         console.log('Result =>', ShareResponse);
    //         setResult(JSON.stringify(ShareResponse, null, 2));
    //     } catch (error) {
    //         console.log('Error =>', error);
    //         setResult('error: '.concat(getErrorString(error)));
    //     }
    // };

    // const shareImage = async () => {
    //     try {
    //         const image = require('./path/to/image.png'); // Replace with your image path
    //         const options = {
    //             title: 'Share image',
    //             message: 'Check out this awesome image!',
    //             url: image,
    //             type: 'image/png',
    //         };
    //         await Share.open(options);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <View>
            <Banner title="Share" />
            <Text>Share this app with your friends!</Text>
            {/* <Button
                onPress={async () => {
                    console.log("hello");
                    await Sharing.shareAsync(
                        // "data:image/png;base64,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"
                        require("../../assets/logo.png")
                    );
                }}
                title="Example button"
            /> */}
            {/* <Button title="Share" onPress={onShare} /> */}
            {/* <Button title="React Native Share" onPress={shareMultipleImages} /> */}
            {/* <Text >{result}</Text> */}
            {/* <Button title="Share Image" onPress={shareImage} /> */}
            {/* <Button
                title="share"
                name="share"
                onPress={() =>
                    openShareDialogAsync(media, {
                        video: media.meta.fileType === 'video',
                    })
                }
            /> */}
            <Image style={{ width: 300, height: 300, margin: 15 }} source={{ uri: image_source }} />


            <TouchableOpacity style={styles.button} onPress={() => share()}>
                <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({})


export default SharePage;
