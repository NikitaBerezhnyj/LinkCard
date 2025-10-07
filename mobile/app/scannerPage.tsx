import React, { useState, useEffect, useRef } from "react";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useAppStyles } from "@/constants/style";
import { Overlay } from "@/components/Overlay";

export default function ScannerPage() {
  const stdStyle = useAppStyles();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [qrContent, setQrContent] = useState<string | null>(null);
  const [isLink, setIsLink] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(false);
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const resetScanner = () => {
    setQrContent(null);
    setIsLink(false);
    setScanned(false);
    setIsScanning(false);
    qrLock.current = false;
    setScanError(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (data && !qrLock.current && isScanning) {
      qrLock.current = true;
      setScanned(true);
      setIsScanning(false);
      const isValidLink = data.startsWith("http://") || data.startsWith("https://");
      setIsLink(isValidLink);
      setQrContent(data);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const handleLinkOpen = async () => {
    if (isLink && qrContent) {
      await Linking.openURL(qrContent);
    }
    setQrContent(null);
    setScanned(false);
  };

  const handleClose = () => {
    resetScanner();
  };

  const startScanning = () => {
    setIsScanning(true);
    setScanned(false);
    setQrContent(null);
    setScanError(false);

    timeoutRef.current = setTimeout(() => {
      if (!scanned) {
        setIsScanning(false);
        setScanError(true);
      }
    }, 2000);
  };

  const renderCamera = () => (
    <View style={StyleSheet.absoluteFillObject}>
      <BarCodeScanner
        onBarCodeScanned={scanned || !isScanning ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <Overlay />
    </View>
  );

  if (hasPermission === null) {
    return (
      <View style={stdStyle.container}>
        <Text style={stdStyle.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={stdStyle.container}>
        <Text style={stdStyle.text}>No access to camera</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={(StyleSheet.absoluteFillObject, stdStyle.container)}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      {renderCamera()}
      <TouchableOpacity style={styles.button} onPress={startScanning} disabled={isScanning}>
        <Text style={styles.buttonText}>
          {isScanning ? "Сканування..." : "Почати сканування QR-коду"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={!!qrContent}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resultContainer}>
            <Text style={styles.title}>
              {isLink ? "В QR код зашифровано посилання:" : "В QR код зашифровано текст:"}
            </Text>
            <Text style={styles.qrContent}>{qrContent}</Text>
            {isLink ? (
              <TouchableOpacity style={styles.button} onPress={handleLinkOpen}>
                <Text style={styles.buttonText}>Перейти за посиланням</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Закрити</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={scanError}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resultContainer}>
            <Text style={styles.title}>QR код не було знайдено</Text>
            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Закрити</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {scanned && !qrContent && (
        <TouchableOpacity style={styles.scanButton} onPress={() => startScanning()}>
          <Text style={styles.buttonText}>Сканувати ще раз</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  resultContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: 300,
    height: 300
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold"
  },
  qrContent: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center"
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10
  },
  scanButton: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -100 }]
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  text: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center"
  }
});
