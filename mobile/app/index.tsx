import React, { useRef, useState } from "react";
import { View, SafeAreaView, StyleSheet, ToastAndroid, Share, Alert } from "react-native";
import ViewShot from "react-native-view-shot";
import QRCode from "react-native-qrcode-svg";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Clipboard from "expo-clipboard";
import ButtonPrimary from "@/components/ButtonPrimary";
import { useAppStyles } from "@/constants/style";

function QRPage() {
  const stdStyles = useAppStyles();
  const viewShotRef = useRef<ViewShot>(null);
  const [busy, setBusy] = useState(false);
  const [qrValue, setQrValue] = useState("https://google.com");

  const downloadQrCode = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "We need permission to save the file.");
        return;
      }

      if (viewShotRef.current && viewShotRef.current.capture !== undefined) {
        setBusy(true);
        const uri = await viewShotRef.current.capture();
        const fileUri = FileSystem.documentDirectory + "YourQrCode.png";

        await FileSystem.moveAsync({
          from: uri,
          to: fileUri
        });

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync("QRCode", asset, false);

        ToastAndroid.show("Saved to gallery!", ToastAndroid.SHORT);
      } else {
        console.error("ViewShot ref is null");
      }
    } catch (error) {
      console.error("Error saving QR code: ", error);
    } finally {
      setBusy(false);
    }
  };

  const shareQrCode = async () => {
    try {
      if (viewShotRef.current && viewShotRef.current.capture !== undefined) {
        setBusy(true);
        const uri = await viewShotRef.current.capture();
        const fileUri = FileSystem.documentDirectory + "YourQrCode.png";

        // Збереження зображення тимчасово для подальшого поширення
        await FileSystem.moveAsync({
          from: uri,
          to: fileUri
        });

        // Поширення QR-коду через Share API
        await Share.share({
          url: fileUri,
          title: "Share Your QR Code",
          message: "Here is your QR code."
        });
      } else {
        console.error("ViewShot ref is null");
      }
    } catch (error) {
      console.error("Error sharing QR code: ", error);
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(qrValue);
    ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
  };

  return (
    <SafeAreaView style={stdStyles.container}>
      <View style={style.qrCodeContainer}>
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
          <QRCode
            value="https://www.google.com/"
            size={200}
            color="#000000"
            backgroundColor="#ffffff"
          />
        </ViewShot>
        <View style={style.actionButtonContainer}>
          <ButtonPrimary title="Copy Link" onPress={copyLink} size={250} />
          <ButtonPrimary title="Share QR" onPress={shareQrCode} size={250} />
          <ButtonPrimary title="Download QR" onPress={downloadQrCode} size={250} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  qrCodeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  actionButtonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "column",
    marginTop: 62
  }
});

export default QRPage;
