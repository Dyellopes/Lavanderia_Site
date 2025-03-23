const jsonUrl = 'https://pastefy.app/mitMWKWy/raw';

// Função para carregar os dados do JSON
fetch(jsonUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById("days-container");
        container.innerHTML = '';
        data.forEach(dayData => {
            const dayDiv = document.createElement("div");
            dayDiv.className = "day";
            dayDiv.innerHTML = `<h2 class="day-title">${dayData.day}</h2>`;
            
            const table = document.createElement("table");
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Sala</th>
                        <th>Assinatura</th>
                        <th>Data</th>
                        <th>Hora</th>
                        <th>Status Entrega</th>
                        <th>Status Devolução</th>
                    </tr>
                </thead>
                <tbody>
                    ${dayData.rooms.map(room => `
                        <tr>
                            <td>${room.room}</td>
                            <td>${room.signature}</td>
                            <td>${room.date}</td>
                            <td>${room.time}</td>
                            <td>
                                <span class="status ${room.status}">
                                    ${room.status === "delivered" ? "✅ Entregue" : "❌ Não entregue"}
                                </span>
                            </td>
                            <td>
                                <span class="status ${room.return_status}">
                                    ${room.return_status === "returned" ? "📦 Devolvido" : "↩️ Não devolvido"}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            dayDiv.appendChild(table);
            container.appendChild(dayDiv);
        });
    })
    .catch(error => {
        console.error("Falha no carregamento:", error);
        const container = document.getElementById("days-container");
        container.innerHTML = `
            <div style="color: red; margin: 20px;">
                <h3>Erro ao carregar dados</h3>
                <p>Verifique:</p>
                <ul>
                    <li>Se os dados estão acessíveis: <a href="${jsonUrl}" target="_blank">${jsonUrl}</a></li>
                    <li>Se há erros de sintaxe no código (use <a href="https://jsonlint.com/" target="_blank">JSONLint</a>)</li>
                </ul>
            </div>
        `;
    });
document.getElementById("download").addEventListener("click", () => {
    const element = document.body; 
    const { jsPDF } = window.jspdf;
    html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const imgWidth = 210; 
        const pageHeight = 297; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width; 
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        pdf.save("pagina-completa.pdf");
    }).catch(err => {
        console.error("Erro ao capturar a página:", err);
    });
});