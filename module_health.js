(()=>{

const now = new Date(), hours = now.getHours();

if (hours >= 22 || hours < 5) {
    $notify('long', 'SLEEP 😴', [['p', {class: 'efy_health_notify_sleep'}, [
        ['p', "It's past "],
        ['a', '22:00'],
        ['p', '. Get some rest']
    ]]], null, 'heart', null, "It's past 22:00. Get some rest");
}

})();