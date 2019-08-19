const fs = require('fs')

// // readFile
// fs.readFile('./README.md', (err, data) => {
//     if (err) {
//         throw err;
//     }
//     console.log(data);
//     console.log(data.toString())
// })

// // writeFile
// fs.writeFile('./fsTestWrite.txt', '테스트입니다.', (err) => {
//     if (err) {
//         throw err
//     }
//     fs.readFile('./fsTestWrite.txt', (err, data) => {
//         if (err) {
//             throw err
//         }
//         console.log(data.toString())
//     })
// })

// // 비동기와 동기
// // ----비동기 방식---- --> 순서가 뒤죽박죽임.
// console.log('시작');
// fs.readFile('./README.md', (err, data) => {
//   if (err) {
//     throw err;
//   }
//   console.log('1번', data.toString());
// });
// fs.readFile('./README.md', (err, data) => {
//   if (err) {
//     throw err;
//   }
//   console.log('2번', data.toString());
// });
// fs.readFile('./README.md', (err, data) => {
//   if (err) {
//     throw err;
//   }
//   console.log('3번', data.toString());
// });
// console.log('끝');

// //---동기 방식--- --> 순서를 지켜줌
// // fs 메서들은 뒤에 Sync 를 붙이면 동기식으로 작동함.
// // --> 단 이게 blocking 방식이기 때문에, 서버가 이것을 처리하느라 다른 일을 처리할 수가 없음
// console.log('시작');
// let data = fs.readFileSync('./README.md');
// console.log('1번', data.toString());
// data = fs.readFileSync('./README.md');
// console.log('2번', data.toString());
// data = fs.readFileSync('./README.md');
// console.log('3번', data.toString());
// console.log('끝');


// MARK: streaming 

const readStream = fs.createReadStream('./README.md', {highWaterMark: 16}); // 몇 바이트씩 읽을꺼냐? 16 바이트씩
const data= [];
// 스트림은 '이벤트 기반'으로 동작.
// 버퍼(chunck)들이 들어올 때마다 data 이벤트가 발생함.
readStream.on('data' , (chunck) => {
    data.push(chunck);
    console.log('data', chunck, chunck.length)
})

//buffer라는 것도 global 에 있는 객체인데, data 배열에 넣은 얘를 합쳐서 사람이 읽을 수 있게끔 만들겠다.
readStream.on('end' , () => {
    console.log('end', Buffer.concat(data).toString());
})

readStream.on('error', (err) => {
    console.log('error', err);
})

// 스트림은 버퍼의 흐름이기 때문에 여러 개의 스트림을 이어 버퍼가 흘러가게 할 수 있음.
const writeStream = fs.createWriteStream('fsTestWrite2.txt')
readStream.pipe(writeStream) // --> 파일을 복사하는 것과 같음. pipe 를 연달아서 쓸 수도 있음.
const zlib = require('zlib') // 압축시키는 모듈
const zlibStream = zlib.createGzip()
readStream.pipe(zlibStream).pipe(writeStream) // 압축을 시킨 것. stream 간에 연달아서 사용할 수 있다.

fs.copyFile('./README.md', './fsTestWrite3.txt', (err) => {
    console.log(err);
})


// fs 모듈의 기타 메서드들

// ----------폴더 만들기.------------
//F --> 존재 여부, R --> 읽기 여부, W --> 쓰기 여부.
fs.access('./folder', fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
  if (err) {
      // 폴더가 없는 경우 뜨는 error 코드
    if (err.code === 'ENOENT') {
      console.log('폴더 없음');
      // 폴더가 없다면 폴더를 만들겠다!
      fs.mkdir('./folder', (err) => {
        if (err) {
          throw err;
        }
        console.log('폴더 만들기 성공');
        //옵션으로 w 를 해놨기 때문에, 없으면 파일을 만듬.
        fs.open('./folder/file.js', 'w', (err, fd) => {
          if (err) {
            throw err;
          }
          console.log('빈 파일 만들기 성공', fd);
          fs.rename('./folder/file.js', './folder/newfile.js', (err) => {
            if (err) {
              throw err;
            }
            console.log('이름 바꾸기 성공');
          });
        });
      });
    } else {
      throw err;
    }
  } else {
    console.log('이미 폴더 있음');
  }
});

// 폴더 지우기
// readdir 를 통해 폴더 안에 무슨 파일들이 있는지 dir 에 저장된다 array 형태로.
fs.readdir('./folder', (err, dir) => {
    if (err) {
        throw err;
    }
    console.log('폴더 내용 확인', dir)
    // 폴더 안에 있는 파일을 지우는 것.
    fs.unlink('./folder/newfile.js', (err) => {
        if (err) {
            throw err;
        }
        console.log('파일 삭제 성공');
        fs.rmdir('./folder', (err) => {
            if (err) {
                throw err;
            }
            console.log('폴더 삭제 성공')
        })
    })
})
