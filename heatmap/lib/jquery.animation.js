/**
 * jquery.animation.js
 * @author qaz-s
 */
(function($){
  /**
   * cssアニメーションを実行します。(IE9以降のモダンブラウザのみ対象)
   * @param  {[String]} animClass (必須)アニメーションのクラス名
   * @param  {Function} animStart アニメーション実行前に実行されるコールバック
   * @param  {Function} animEnd   アニメーション実行後に実行されるコールバック
   * @return {jQuertObject}
   */
  $.fn.animation = function(animClass, animStart, animEnd) {
    if (!animClass) return;

    var onAnimStart = function () {
      if (animStart) animStart();
    };
    var onAnimEnd = function () {
      if (animEnd) animEnd();
      $(this).unbind('animationstart webkitAnimationStart');
      $(this).unbind('animationend webkitAnimationEnd');
      $(this).removeClass('animating default-animation-config ' + animClass);
      $(this).css({
        '-webkit-animation': '',
        'animation': ''
      });
    };

    $(this).bind('animationstart webkitAnimationStart', onAnimStart);
    $(this).bind('animationend webkitAnimationEnd', onAnimEnd);
    $(this).addClass('animating default-animation-config ' + animClass);

    return $(this).extend({
      /**
       * 一時停止状態のアニメーションを再開します。
       */
      play: function () {
        $(this).css({
          '-webkit-animation-play-state': 'running',
          'animation-play-state': 'running'
        });
        return $(this);
      },
      /**
       * 再生状態のアニメーションを一時停止します。
       */
      pause: function () {
        $(this).css({
          '-webkit-animation-play-state': 'paused',
          'animation-play-state': 'paused'
        });
        return $(this);
      },
      /**
       * 指定された回数アニメーションを実行します。(デフォルトinfinite)
       * @param  {Number} cnt 再生回数
       */
      repeat: function (cnt) {
        var count = cnt ? String(cnt): 'infinite';
        $(this).css({
          '-webkit-animation-iteration-count': count,
          'animation-iteration-count': count
        });
        return $(this);
      },
      /**
       * アニメーションの状態に関わらずアニメーションを停止します。
       */
      stop: function () {
        onAnimEnd();
        return $(this);
      }
    });
  };
})(jQuery);
