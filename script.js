const jsonUrl = 'https://pastefy.app/mitMWKWy/raw';

fetch(jsonUrl)
    .then(response => {
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
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
        document.getElementById("days-container").innerHTML = `
            <div style="color: red; margin: 20px;">
                <h3>Erro ao carregar dados</h3>
                <p>Verifique:</p>
                <ul>
                    <li>Se o dados está acessível: <a href="${jsonUrl}" target="_blank">${jsonUrl}</a></li>
                    <li>Se há erros de sintaxe no codgo (use <a href="https://jsonlint.com/" target="_blank">JSONLint</a>)</li>
                </ul>
            </div>
        `;
    });