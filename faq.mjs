// programmatically generate FAQ table of contents

const toc = document.getElementById("faq_toc");
const dts = document.querySelectorAll("dl>dt");
for (let dt of dts) {
    let a = document.createElement("a");
    let text = document.createTextNode(dt.innerText);
    a.appendChild(text);
    a.href = `#${dt.id}`;

    let li = document.createElement("li");
    li.appendChild(a);
    toc.appendChild(li);
}
