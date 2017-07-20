const TIME = {
  POMODORO: 25 * 60,
  BREAK_SHORT: 5 * 60,
  BREAK_LONG: 15 * 60
};

const STATUS = {
  POMODORO: 'pomodoro',
  BREAK_SHORT: 'break_short',
  BREAK_LONG: 'break_long'
};

class Pomodoro {
  constructor(callback) {
    this.callback = callback;
    this.intervalID = null;
    this.prevTime = null;
    this.count = {pomodoro: 0, break: 0};
    this.status = this._getStatus();
    this.remainTime = this._getRemainTime();
  }
  /**
   * ポモドーロを開始します。
   */
  start() {
    if (this.intervalID) return;
    this._update();
    this.intervalID = setInterval(() => this._update(), 1000);
  }
  /**
   * ポモドーロを停止します。
   */
  stop() {
    if (!this.intervalID) return;
    clearInterval(this.intervalID);
    this.intervalID = null;
    this.prevTime = null;
  }
  /**
   * ポモドーロをリセットします。
   */
  reset() {
    this.remainTime = this._getRemainTime();
  }
  /**
   * ポモドーロの実績を取得します。
   */
  getCount() {
    return this.count;
  }
  /**
   * 経過時間に対して内部情報を更新します。
   */
  _update() {
    if (!this.prevTime) {
      this.prevTime = this._getTime();
      return;
    }
    const nextTime = this._getTime();
    const diffTime = nextTime - this.prevTime;
    this.remainTime = this.remainTime - diffTime;
    this.prevTime = nextTime;
    if (this.remainTime <= 0) {
      (this.status === STATUS.POMODORO) ? this.count.pomodoro++ : this.count.break++;
      this.status = this._getStatus();
      this.remainTime = this._getRemainTime();
    }
    this.callback(this.status, this.remainTime);
  }
  /**
   * 現在時刻の時刻差を秒単位で取得します。
   */
  _getTime() {
    return Math.round(new Date().getTime() / 1000);
  }
  /**
   * ポモドーロステータスを取得します。
   */
  _getStatus() {
    let status;
    if (this.count.pomodoro === this.count.break) {
      status = STATUS.POMODORO;
    } else if (this.count.pomodoro % 4 === 0) {
      status = STATUS.BREAK_LONG;
    } else if (this.count.pomodoro > this.count.break) {
      status = STATUS.BREAK_SHORT;
    }
    return status;
  }
  /**
   * ポモドーロステータスに紐付く時間を取得します。
   */
  _getRemainTime() {
    let time;
    if (this.status === STATUS.POMODORO) {
      time = TIME.POMODORO;
    } else if (this.status === STATUS.BREAK_SHORT) {
      time = TIME.BREAK_SHORT;
    } else if (this.status === STATUS.BREAK_LONG) {
      time = TIME.BREAK_LONG;
    }
    return time;
  }
}