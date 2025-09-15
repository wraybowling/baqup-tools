(function () {
  const confirmSpendingQubes = window.confirm(
    'Click on every Spending Qube once before continuing. Ready?'
  );

  if (!confirmSpendingQubes) {
    alert(
      'Please go back and click on every spending qube before downloading your data.'
    );
    return;
  }

  function downloadJson(jsonString, label) {
    var anchor = document.createElement('a');
    anchor.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString)
    );
    var timestamp = new Date().toISOString().slice(0, 10);
    anchor.setAttribute('download', `baqup-${label} ${timestamp}.json`);
    anchor.setAttribute('target', '_blank');
    anchor.style.display = 'none';
    document.body.appendChild(anchor);

    anchor.click();
  }

  const cache = JSON.parse(localStorage.getItem('vuex'));

  const currentURL = new URL(window.location.href);
  if (
    !cache ||
    currentURL.protocol !== 'https:' ||
    currentURL.hostname !== 'dashboard.qubemoney.com'
  ) {
    alert('You must be viewing Qube and logged in to download your data.');
    return;
  }

  downloadJson(localStorage.getItem('vuex'), 'account');
})();
