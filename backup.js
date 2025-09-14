javascript: (function () {
  const accountInfo = JSON.parse(localStorage.getItem("vuex"));

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `https://api.qubemoney.com/api/qubes/?account_id=${accountInfo.authentication.account.id}&limit=9999`,
    true
  );
  request.onload = function () {
    var response = JSON.parse(request.responseText);
    var jsonLink = document.createElement("a");
    jsonLink.setAttribute(
      "href",
      "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(response))
    );
    var timestamp = new Date().toISOString().replace(/[:\-\.]/g, "");
    jsonLink.setAttribute("download", `qube-backup-${timestamp}.json`);
    jsonLink.setAttribute("target", "_blank");
    jsonLink.style.display = "none";
    document.body.appendChild(jsonLink);

    jsonLink.click();
  };
  request.send();
})();
