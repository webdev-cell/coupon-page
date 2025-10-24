(function ($) {
  $(function () {
    var $inputArea = $('.coupon-input-area');
    var $input = $inputArea.find('input[type="text"]');
    var $submit = $inputArea.find('button');
    var $modal = $('.modal');
    var $msgList = $modal.find('p'); // [0]=성공, [1]=실패
    var $btnClose = $modal.find('.close');
    var $btnConfirm = $modal.find('.confirm');
    var busy = false; // 중복 제출 방지

    function sanitize(code) {
      // 공백 제거 + 트림 (대소문자 유지해도 무방하지만 일관성 위해 Uppercase)
      return $.trim(code).replace(/\s+/g, '').toUpperCase();
    }

    function openModal(type) {
      // 메시지 표시 제어
      $msgList.hide();
      if (type === 'success') {
        $msgList.eq(0).show();
      } else {
        $msgList.eq(1).show();
      }
      $modal.addClass('active');

      // 확인 버튼에 포커스(Enter로 곧바로 닫힐 수 있게)
      // 버튼이 렌더/표시된 뒤 포커스 주도록 살짝 지연
      setTimeout(function () {
        $btnConfirm.focus();
      }, 0);
    }

    function closeModal() {
      $modal.removeClass('active');
      $msgList.hide();
      $input.focus();
    }

    function handleSubmit() {
      if (busy) return;

      var code = sanitize($input.val());

      // === 요구사항: 입력값 유무만으로 성공/실패 판정 ===
      var isSuccess = !!code;

      busy = true;
      $submit.prop('disabled', true);

      // 서버 연동 대신 즉시 결과 처리
      setTimeout(function () {
        if (isSuccess) {
          openModal('success');
          $input.val(''); // 성공 시 입력값 초기화
        } else {
          openModal('error');
        }
        busy = false;
        $submit.prop('disabled', false);
      }, 0);
    }

    // 제출 버튼 클릭
    $submit.on('click', function (e) {
      e.preventDefault();
      // 모달이 열려있으면 무시
      if ($modal.hasClass('active')) return;
      handleSubmit();
    });

    // 입력창 Enter 제출
    $input.on('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if ($modal.hasClass('active')) return; // 모달 열려 있으면 제출 막기
        handleSubmit();
      }
    });

    // 모달 닫기: X/확인 버튼만 허용
    $btnClose.add($btnConfirm).on('click', function () {
      closeModal();
    });

    // 전역 키 핸들러: 모달 열려 있을 때 Enter/Esc로 닫기
    $(document).on('keydown', function (e) {
      if (!$modal.hasClass('active')) return;

      if (e.key === 'Enter' || e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        closeModal();
      }
    });
  });
})(jQuery);
