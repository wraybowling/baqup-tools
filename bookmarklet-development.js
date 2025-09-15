(function () {
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

  function downloadTransactions(url, fileNum = 0) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader(
      'Authorization',
      `Token ${cache.authentication.token}`
    );
    xhr.addEventListener('loadend', (event) => {
      if (
        event.currentTarget.status == 200 &&
        event.currentTarget.responseText
      ) {
        const response = JSON.parse(event.currentTarget.responseText);

        if (!response.results || !response.results.length) return;
        downloadJson(
          JSON.stringify(response.results),
          `transactions-${fileNum}`
        );

        if (!response.next) return;
        downloadTransactions(response.next, fileNum + 20);
      }
    });

    xhr.send();
  }

  downloadTransactions(
    `https://api.qubemoney.com/api/search/transactions/?account_id=${cache.authentication.account.id}&filter_date_range=all&filter_transaction_type=all&limit=20&offset=0`,
    0
  );
})();
