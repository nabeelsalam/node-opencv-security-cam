
const cv = require('opencv');

//camera configuration
const CAM_WIDTH = 640;
const CAM_HEIGHT = 480;
const CAM_INTERVAL = 100;

const CLASSIFIER = './data/haarcascade_eye_tree_eyeglasses.xml';
const OUT_PATH = './output/intruder';

// initialize camera
const camera = new cv.VideoCapture(0);
camera.setWidth(CAM_WIDTH);
camera.setHeight(CAM_HEIGHT);

setInterval(() => {
  camera.read((err, img) => {
    if (err)
      throw err;
    //grayscale helps detect objects better in some cases
    //img.convertGrayscale();
    img.detectObject(CLASSIFIER, {}, function(err, objects) {
      if (err)
        throw err;
      if (objects.length >= 2) {
        for (var i = 0; i < objects.length; i++) {
          var object = objects[i];
          img.ellipse(object.x + object.width / 2, object.y + object.height / 2, object.width / 2, object.height / 2, [255, 255, 0], 3);
        }
        let outputFilePath = `${OUT_PATH}-${Date.now()}.jpg`;
        img.save(outputFilePath);
        console.error(`Intruder detected!! Image saved to ${outputFilePath}`);
      }

    })
  });
}, CAM_INTERVAL);

console.log('On Watch...')