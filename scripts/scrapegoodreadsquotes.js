const a = [...document.getElementsByClassName('quoteText')]
    .map(q => q.innerText.split('― '))
    .map(([q,a]) => [q.slice(1,-2).replaceAll('\n', ' '), a])
    .map(([q,a]) => q + '|' + a + '|')
    .join('\n'); console.log(a)