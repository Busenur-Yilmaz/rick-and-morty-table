module.exports = {
    testEnvironment: "jsdom", // React projelerinde doğru ortamı belirlemek için
    transform: {
      "^.+\\.[jt]sx?$": "babel-jest", // Babel ile .js, .jsx, .ts ve .tsx dosyalarını dönüştür
    },
    transformIgnorePatterns: [
      "/node_modules/(?!(axios)/)", // `node_modules` içindeki axios'u dönüştür
    ],
    moduleFileExtensions: ["js", "jsx", "json", "node"], // Dosya uzantılarını tanımla
  };
  