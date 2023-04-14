import { Injectable } from '@nestjs/common';
import * as shuffle from 'shuffle-array';

@Injectable()
export class DummyDataGenerator {
    dummy = [];
    dummyData = {
      commit: [],
      cc: [],
      blog: []
  };
  private currentMonthDate = [];

  dataInit() {
    this.getCurMonthData();
    this.dummyData.commit = this.genCommitData();
    this.dummyData.cc = this.genCcData();
    this.dummyData.blog = this.genBolgData();
    this.setDummyData();
  }

  setDummyData() {
    this.dummy = [];
    for(const [key, date] of this.currentMonthDate.entries()){
        this.dummy.push({
            logDate: date,
            commit: this.dummyData.commit[key],
            cc: this.dummyData.cc[key],
            blog: this.dummyData.blog[key],
        });
    }
  }

  getCurMonthData() {
    this.currentMonthDate = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    for (let day = 1; day <= today.getDate(); day++) {
      const date = new Date(year, month, day+1);
      this.currentMonthDate.push(date.toISOString().slice(0, 10));
    }
  }

  genCommitData(): number[] {
    const arr: number[] = [];

    // 0의 비율 30%
    for (let i = 0; i < 9; i++) {
      arr.push(0);
    }

    // 10 이하의 숫자 - 60%
    for (let i = 0; i < 19; i++) {
      arr.push(Math.floor(Math.random() * 10) + 1);
    }

    // 10~20 - 5%
    for (let i = 0; i < 2; i++) {
      arr.push(Math.floor(Math.random() * 11) + 10);
    }

    // 30 이상의 수 - 5%비율로
    for (let i = 0; i < 1; i++) {
      arr.push(Math.floor(Math.random() * 21) + 30);
    }

    arr.sort(() => Math.random() - 0.5);
    return shuffle(arr);
  }  

  genCcData(): number[] {
    let arr: number[] = [];
    const count = Math.floor(Math.random() * 10) + 1; // 증가수열의 갯수 랜덤 지정
    const f = this.randomBool();

    if (f) {
      const sepLen = Math.floor(Math.random() * 10) + 1; // 구분자의 길이 랜덤 지정
      for (let k = 0; k < sepLen; k++) {
        arr.push(0);
      }
    }

    for (let i = 0; i < count; i++) {
      const length = Math.floor(Math.random() * 10) + 1; // 각 증가수열의 길이 랜덤 지정
      for (let j = 1; j <= length; j++) {
        arr.push(j); // 1부터 시작하면서 1씩 증가하는 수열 생성
      }
      if (i < count - 1) { // 마지막 증가수열은 구분자를 만들지 않음
        const sepLen = Math.floor(Math.random() * 10) + 1; // 구분자의 길이 랜덤 지정
        for (let k = 0; k < sepLen; k++) {
          arr.push(0);
        }
      }
    }

    while (arr.length < 31) {
      arr.push(0);
    }

    arr = arr.slice(0, 31);
    return arr;
  }

  genBolgData() {
    let arr: number[] = [];

    // 0의 비율 60%
    for (let i = 0; i < 18; i++) {
      arr.push(0);
    }

    // 1~2 비율 39%
    for (let i = 0; i < 12; i++) {
      arr.push(Math.floor(Math.random() * 2) + 1);
    }

    // 3~5 비율 1%
    for (let i = 0; i < 1; i++) {
      arr.push(Math.floor(Math.random() * 3) + 3);
    }

    arr = shuffle(arr);
    return arr;
  }

  randomBool(): boolean {
    return Math.random() < 0.5;
  }
}
