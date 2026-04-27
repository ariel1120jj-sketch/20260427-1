// 定義全域變數
let video;
let poseNet;
let poses = [];

function setup() {
  // 建立畫布並放置於網頁上
  createCanvas(640, 480);

  // 1. 啟動攝影機
  video = createCapture(VIDEO, function(stream) {
    console.log("攝影機已成功連線");
  }, function(err) {
    console.error("無法存取攝影機: ", err);
    alert("找不到攝影機或權限被拒絕，請檢查瀏覽器設定。");
  });
  
  video.size(width, height);

  // 2. 初始化 PoseNet 模型
  // 傳入 video 並在準備好時呼叫 modelReady
  poseNet = ml5.poseNet(video, modelReady);

  // 3. 設定監聽：當偵測到姿勢時，更新 poses 陣列
  poseNet.on('pose', function(results) {
    poses = results;
  });

  // 隱藏原始的 HTML 影片標籤，我們要在畫布上畫出來
  video.hide();
}

// 當模型載入完成後執行的動作
function modelReady() {
  console.log("PoseNet 模型準備就緒！");
  select('#status').html('模型已載入 (Model Loaded)');
}

function draw() {
  // 每一幀都重新繪製攝影機畫面
  image(video, 0, 0, width, height);

  // 呼叫自定義函數繪製紅點與骨架
  drawKeypoints();
  drawSkeleton();
}

// 繪製關節點 (例如：鼻子、眼睛、肩膀)
function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // 只有當偵測信心值高於 0.2 時才畫出來
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// 繪製連結點與點之間的骨架線段
function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      strokeWeight(2);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}