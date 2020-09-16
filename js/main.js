'use strict';

(() => {
  let yOffset = 0; // = window.pageYOffet
  let prevScrollHeight = 0; // summary height before current scene
  let currentScene = 0; // what we see now?
  let newScene = false; // true only when change scene

  // variable for smooth animation
  let acc = 0.1; // 
  let delayedYOffset = 0;
  let rafId; // requestAnimationFrameID
  let rafState; // What requestAnimationFrame state

  const sceneInfo = [
    {
      // #section-0
      type: 'sticky',
      heightNum: 6, // 브라우저 높이의 5배로 scrollheight setting
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#section-0'),
        messageA: document.querySelector('#section-0 .main-message.a'),
        messageB: document.querySelector('#section-0 .main-message.b'),
        messageC: document.querySelector('#section-0 .main-message.c'),
        messageD: document.querySelector('#section-0 .main-message.d'),
        messageE: document.querySelector('#section-0 .main-message.e'),
        canvas: document.querySelector('#video-0'),
        context: document.querySelector('#video-0').getContext('2d'), // 캔버스에 생성할 context
        videoImages: [], // 해당 이미지 가져오기
      },
      values: {
        // Canvas
        videoImageCount: 200, // 들어갈 이미지 갯수
        imageSequence: [0, 199], // 이미지 갯수에 따라 0-299까지 (씬 전체에서 재생되기 떄문에 start, end 없이)
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
        // A
        messageA_translate_in: [20, 0, { start: 0.09, end: 0.16 }],
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.15 }],
        messageA_translate_out: [0, -20, { start: 0.19, end: 0.26 }],
        messageA_opacity_out: [1, 0, { start: 0.2, end: 0.25 }],
        // B
        messageB_translate_in: [20, 0, { start: 0.25, end: 0.32 }],
        messageB_opacity_in: [0, 1, { start: 0.26, end: 0.31 }],
        messageB_translate_out: [0, -20, { start: 0.35, end: 0.42 }],
        messageB_opacity_out: [1, 0, { start: 0.36, end: 0.41 }],
        // C
        messageC_translate_in: [20, 0, { start: 0.41, end: 0.48 }],
        messageC_opacity_in: [0, 1, { start: 0.42, end: 0.47 }],
        messageC_translate_out: [0, -20, { start: 0.51, end: 0.58 }],
        messageC_opacity_out: [1, 0, { start: 0.52, end: 0.57 }],
        // D
        messageD_translate_in: [20, 0, { start: 0.57, end: 0.64 }],
        messageD_opacity_in: [0, 1, { start: 0.58, end: 0.63 }],
        messageD_translate_out: [0, -20, { start: 0.67, end: 0.74 }],
        messageD_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
        // E
        messageE_translate_in: [20, 0, { start: 0.73, end: 0.8 }],
        messageE_opacity_in: [0, 1, { start: 0.74, end: 0.79 }],
        messageE_translate_out: [0, -20, { start: 0.83, end: 0.9 }],
        messageE_opacity_out: [1, 0, { start: 0.84, end: 0.89 }],
      }
    },
    {
      // #section-1
      type: 'normal',
      heightNum: 1.5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#section-1')
      },
    },
    {
      // #section-2
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#section-2'),
        messageA: document.querySelector('#section-2 .main-message.a'),
        messageB: document.querySelector('#section-2 .desc-message.b'),
        messageC: document.querySelector('#section-2 .desc-message.c'),
        pinB: document.querySelector('#section-2 .b .pin'),
        pinC: document.querySelector('#section-2 .c .pin'),
        canvas: document.querySelector('#video-1'),
        context: document.querySelector('#video-1').getContext('2d'),
        videoImages: [],
      },
      values: {
        // Canvas
        videoImageCount: 750, // 들어갈 이미지 갯수
        imageSequence: [0, 749], // 이미지 갯수에 따라 0-299까지 (씬 전체에서 재생되기 떄문에 start, end 없이)
        canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
        canvas_opacity_out: [1, 0, { start: 0.9, end: 1 }],
        // A (main)
        messageA_translate_in: [20, 0, { start: 0.09, end: 0.2 }],
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.19 }],
        messageA_translate_out: [0, -20, { start: 0.25, end: 0.32 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.31 }],

        // B
        messageB_translate_in: [30, 0, { start: 0.38, end: 0.46 }],
        messageB_opacity_in: [0, 1, { start: 0.4, end: 0.45 }],
        messageB_translate_out: [0, -20, { start: 0.5, end: 0.57 }],
        messageB_opacity_out: [1, 0, { start: 0.5, end: 0.56 }],
        pinB_scaleY: [0.5, 1, { start: 0.38, end: 0.46 }],

        // C
        messageC_translate_in: [30, 0, { start: 0.63, end: 0.71 }],
        messageC_opacity_in: [0, 1, { start: 0.65, end: 0.7 }],
        messageC_translate_out: [0, -20, { start: 0.75, end: 0.82 }],
        messageC_opacity_out: [1, 0, { start: 0.75, end: 0.81 }],
        pinC_scaleY: [0.5, 1, { start: 0.63, end: 0.71 }],
      }
    },
    {
      // #section-3
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#section-3'),
        canvasCaption: document.querySelector('.canvas-caption'),
        message: document.querySelector('#section-3 .desc-message'),
        canvas: document.querySelector('.blend-canvas'),
        context: document.querySelector('.blend-canvas').getContext('2d'),
        imagePath: [
          './src/img/blend-1.jpg',
          './src/img/blend-2.jpg'
        ],
        images: []
      },
      values: {
        // scroll되면서 계산하도록 -> playAnimation():348
        rect1X: [0, 0, { start: 0, end: 0 }],
        rect2X: [0, 0, { start: 0, end: 0 }],
        blendHeight: [0, 0, { start: 0, end: 0 }], // 캔버스가 고정된 순간부터(start) 이미지가 모두 블렌드 된 순간(end)
        canvasScale: [0, 0, { start: 0, end: 0 }],
        caption_opacity: [0, 1, { start: 0, end: 0 }],
        caption_translateY: [30, 0, { start: 0, end: 0 }],
        canvasStartY: 0,
      }
    }
  ];

  function setCanvasImages() {
    let imgElem1;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem1 = new Image();
      imgElem1.src = `./src/001/IMG_${2765 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(imgElem1);
    }

    let imgElem2;
    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      imgElem2 = new Image();
      imgElem2.src = `./src/002/IMG_${3102 + i}.JPG`;
      sceneInfo[2].objs.videoImages.push(imgElem2);
    }

    let imgElem3;
    for (let i = 0; i < sceneInfo[3].objs.imagePath.length; i++) {
      imgElem3 = new Image();
      imgElem3.src = sceneInfo[3].objs.imagePath[i];
      sceneInfo[3].objs.images.push(imgElem3);
    }
  }

  function checkMenu() {
    if (yOffset > 44) {
      document.body.classList.add('local-nav-sticky');
    } else {
      document.body.classList.remove('local-nav-sticky');
    }
  }

  function setLayout() {
    // set the height for each section
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === 'sticky') {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === 'normal') {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;

    let totalScroll = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScroll += sceneInfo[i].scrollHeight;
      if (totalScroll >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute('id', `scene-${currentScene}`);

    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  }



  function calcValues(values, currentYOffset) {
    let result;
    // make ratio number 0 to 1
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // play animation between start-end
      const partStart = values[2].start * scrollHeight;
      const partEnd = values[2].end * scrollHeight;
      const partHeight = partEnd - partStart;

      if (currentYOffset >= partStart && currentYOffset <= partEnd) {
        result = (currentYOffset - partStart) / partHeight * (values[1] - values[0]) + values[0];
      } else if (currentYOffset < partStart) {
        result = values[0];
      } else if (currentYOffset > partEnd) {
        result = values[1];
      }

    } else {
      result = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return result;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight; // (현재 section의 진행 정도) / (현재 씬의 scrollHeight) 
    // console.log(currentScene, currentYOffset);

    switch (currentScene) {
      case 0:
        // console.log('play 0');

        // loop():515
        // let sequence1 = Math.round(calcValues(values.imageSequence, currentYOffset));
        // objs.context.drawImage(objs.videoImages[sequence1], 0, 0);

        if (scrollRatio < 0.18) {
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translate_in, currentYOffset)}%, 0)`;
        } else {
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translate_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio < 0.35) {
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translate_in, currentYOffset)}%, 0)`;
        } else {
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translate_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio < 0.5) {
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translate_in, currentYOffset)}%, 0)`;
        } else {
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translate_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio < 0.65) {
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translate_in, currentYOffset)}%, 0)`;
        } else {
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translate_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio < 0.81) {
          objs.messageE.style.opacity = calcValues(values.messageE_opacity_in, currentYOffset);
          objs.messageE.style.transform = `translate3d(0, ${calcValues(values.messageE_translate_in, currentYOffset)}%, 0)`;
        } else {
          objs.messageE.style.opacity = calcValues(values.messageE_opacity_out, currentYOffset);
          objs.messageE.style.transform = `translate3d(0, ${calcValues(values.messageE_translate_out, currentYOffset)}%, 0)`;
        }

        objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

        break;


      case 2:
        // console.log('play 2');

        // loop():519
        // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
        // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

        if (scrollRatio < 0.25) {
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translate_in, currentYOffset)}%, 0)`;
        } else {
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translate_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio < 0.5) {
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translate_in, currentYOffset)}%, 0)`;
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
        } else {
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translate_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio < 0.75) {
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translate_in, currentYOffset)}%, 0)`;
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
        } else {
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translate_out, currentYOffset)}%, 0)`;
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
        }


        // currentScene에서 3에서 쓰는 캔버스를 미리 그려주기 시작
        if (scrollRatio >= 0.9) {
          const objs = sceneInfo[3].objs;
          const values = sceneInfo[3].values;
          const widthRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;
          let canvasScaleRatio;

          if (widthRatio <= heightRatio) {
            // 캔버스보다 브라우저 창이 홀쭉한 경우
            canvasScaleRatio = heightRatio;
          } else {
            // 캔버스보다 브라우저 창이 납작한 경우
            canvasScaleRatio = widthRatio;
          }

          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          objs.context.drawImage(objs.images[0], 0, 0);

          // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
          // *document.body.offsetWidth : 브라우저의 스크롤바를 제외한 body의 폭
          const recalculatedWidth = document.body.offsetWidth / canvasScaleRatio;

          // 좌우 박스에 필요한 값 계산
          const spaceWidth = recalculatedWidth * 0.15;
          values.rect1X[0] = (objs.canvas.width - recalculatedWidth) / 2; // start (캔버스의 원래 넓이 - 계산된 창 넓이)/2
          values.rect1X[1] = values.rect1X[0] - spaceWidth; // end
          values.rect2X[0] = values.rect1X[0] + recalculatedWidth - spaceWidth; // start (rect1의 시작점 + 계산된 창 넓이 - rect2의 넓이)
          values.rect2X[1] = values.rect2X[0] + spaceWidth; // end

          // 좌우 박스 그리기
          // X, Y, width, height
          objs.context.fillRect(
            parseInt(values.rect1X[0]),
            0,
            parseInt(spaceWidth),
            objs.canvas.height);
          objs.context.fillRect(
            parseInt(values.rect2X[0]),
            0,
            parseInt(spaceWidth),
            objs.canvas.height);
        }

        break;


      case 3:
        // console.log('play 3');
        let step = 0;
        // 가로, 세로 모두 꽉 차게 하기 위해 여기에서 세팅(계산 필요)
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;
        let canvasScaleRatio;

        if (widthRatio <= heightRatio) {
          // 캔버스보다 브라우저 창이 홀쭉한 경우
          canvasScaleRatio = heightRatio;
        } else {
          // 캔버스보다 브라우저 창이 납작한 경우
          canvasScaleRatio = widthRatio;
        }

        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.context.drawImage(objs.images[0], 0, 0);

        // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
        // *document.body.offsetWidth : 브라우저의 스크롤바를 제외한 body의 폭
        const recalculatedWidth = document.body.offsetWidth / canvasScaleRatio;

        if (!values.canvasStartY) {
          // values.canvasStartY = objs.canvas.getBoundingClientRect().top;
          const scaleGap = (objs.canvas.height - (objs.canvas.height * canvasScaleRatio)) / 2; // canvas를 scale로 조정하면서 생긴 오차
          values.canvasStartY = objs.canvas.offsetTop + scaleGap;

          values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
          values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
          values.rect1X[2].end = values.canvasStartY / scrollHeight;
          values.rect2X[2].end = values.canvasStartY / scrollHeight;
        }

        // 좌우 박스에 필요한 값 계산
        const spaceWidth = recalculatedWidth * 0.15;
        values.rect1X[0] = (objs.canvas.width - recalculatedWidth) / 2; // start (캔버스의 원래 넓이 - 계산된 창 넓이)/2
        values.rect1X[1] = values.rect1X[0] - spaceWidth; // end
        values.rect2X[0] = values.rect1X[0] + recalculatedWidth - spaceWidth; // start (rect1의 시작점 + 계산된 창 넓이 - rect2의 넓이)
        values.rect2X[1] = values.rect2X[0] + spaceWidth; // end

        // 좌우 박스 그리기
        // X, Y, width, height
        objs.context.fillRect(
          parseInt(calcValues(values.rect1X, currentYOffset)),
          0,
          parseInt(spaceWidth),
          objs.canvas.height);
        objs.context.fillRect(
          parseInt(calcValues(values.rect2X, currentYOffset)),
          0,
          parseInt(spaceWidth),
          objs.canvas.height);

        if (scrollRatio < values.rect1X[2].end) {
          // step 1
          objs.canvas.classList.remove('sticky');
        } else {
          // step 2
          // image blend
          // blendHeight: [0, 0, { start: 0, end: 0 }]
          values.blendHeight[0] = 0;
          values.blendHeight[1] = objs.canvas.height;
          values.blendHeight[2].start = values.rect1X[2].end;
          values.blendHeight[2].end = values.blendHeight[2].start + 0.2; // + 재생시간
          // MDN https://developer.mozilla.org/ko/docs/Web/API/CanvasRenderingContext2D/drawImage
          // void stx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
          // s = source의 좌표, 크기, d = canvas에 그리는 위치 좌표, 크기
          const blendHeight = calcValues(values.blendHeight, currentYOffset);
          objs.context.drawImage(
            objs.images[1],
            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
          );

          objs.canvas.classList.add('sticky');
          const scaleGap = (objs.canvas.height - (objs.canvas.height * canvasScaleRatio)) / 2;
          objs.canvas.style.top = `${-1 * scaleGap}px`;

          if (scrollRatio > values.blendHeight[2].end) {
            // step 3
            values.canvasScale[0] = canvasScaleRatio;
            values.canvasScale[1] = document.body.offsetWidth / (objs.canvas.width * 1.2);
            values.canvasScale[2].start = values.blendHeight[2].end;
            values.canvasScale[2].end = values.canvasScale[2].start + 0.2; // + 재생시간

            objs.canvas.style.transform = `scale(${calcValues(values.canvasScale, currentYOffset)})`;
          }

          if (scrollRatio > values.canvasScale[2].end
            && values.canvasScale[2].end > 0) {
            objs.canvas.classList.remove('sticky');
            objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`; // 위 두 구간의 총 재생시간

            values.caption_opacity[2].start = values.canvasScale[2].end;
            values.caption_opacity[2].end = values.caption_opacity[2].start + 0.15;
            values.caption_translateY[2].start = values.caption_opacity[2].start;
            values.caption_translateY[2].end = values.caption_opacity[2].end;
            objs.canvasCaption.style.opacity = calcValues(values.caption_opacity, currentYOffset);
            objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.caption_translateY, currentYOffset)}%, 0)`;

          } else {
            objs.canvasCaption.style.opacity = 0;
            objs.canvas.style.marginTop = 0;
          }

        }

        break;
    }
  }

  function scrollLoop() {
    newScene = false;

    // calculate prevScene(s) height
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      document.body.classList.remove('scroll-effect-end');
    }

    // change current-scene by scroll direction(down/ up)
    if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      newScene = true;
      if (currentScene === sceneInfo.length - 1) {
        document.body.classList.add('scroll-effect-end');
      }
      if (currentScene < sceneInfo.length - 1) {
        currentScene++;
      }
      document.body.setAttribute('id', `scene-${currentScene}`);
    }

    if (delayedYOffset < prevScrollHeight) {
      newScene = true;
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute('id', `scene-${currentScene}`);
    }

    if (newScene) return;

    playAnimation();
  }

  function loop() {
    delayedYOffset += (yOffset - delayedYOffset) * acc; // ** 가속도가 적용된 yOffset

    if (!newScene) {

      const currentYOffset = delayedYOffset - prevScrollHeight;
      const objs = sceneInfo[currentScene].objs;
      const values = sceneInfo[currentScene].values;
      if (currentScene === 0) {
        let sequence1 = Math.round(calcValues(values.imageSequence, currentYOffset));
        objs.videoImages[sequence1] && objs.context.drawImage(objs.videoImages[sequence1], 0, 0);
      }
      if (currentScene === 2) {
        let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
        objs.videoImages[sequence2] && objs.context.drawImage(objs.videoImages[sequence2], 0, 0);
      }

    }

    // 1️⃣: loop the function loop() & 2️⃣
    rafId = requestAnimationFrame(loop);

    // 2️⃣: & 식이 멈출 떄까지 반복하면서 감속
    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }

  }


  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
    checkMenu();

    if (!rafState) {
      rafId = requestAnimationFrame(loop);
      rafState = true;
    }
  });

  window.addEventListener('load', () => {
    document.body.classList.remove('before-load');
    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
  });

  window.addEventListener('resize', () => {
    if (document.body.offetWidth > 900) {
      setLayout();
    }
    sceneInfo[3].values.canvasStartY = 0;
  });

  window.addEventListener('orientationchange', setLayout);

  document.querySelector('.loading').addEventListener('transitionend', (event) => {
    document.body.removeChild(event.currentTarget);
  });


  setCanvasImages();

})();