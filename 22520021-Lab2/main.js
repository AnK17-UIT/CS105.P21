const { app, shell } = require("electron");
const path = require("path");
const httpServer = require("http-server");

// Đường dẫn đến thư mục chứa index.html
const projectPath = path.join(__dirname, "Lab_02");

// Cổng cho server cục bộ
const port = 8000;

// Khởi động server cục bộ
const server = httpServer.createServer({ root: projectPath });

app.whenReady().then(() => {
    // Bắt đầu server
    server.listen(port, "localhost", () => {
        console.log(`Server is running at http://localhost:${port}`);

        // Mở trình duyệt mặc định với URL localhost
        shell.openExternal(`http://localhost:${port}`);
    });
});

app.on("window-all-closed", () => {
    // Đóng server khi thoát ứng dụng
    server.close();
    if (process.platform !== "darwin") app.quit();
});