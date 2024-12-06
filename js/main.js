class ImageCompressor {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.currentFile = null;
    }

    initializeElements() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.previewSection = document.getElementById('previewSection');
        this.originalPreview = document.getElementById('originalPreview');
        this.compressedPreview = document.getElementById('compressedPreview');
        this.originalSize = document.getElementById('originalSize');
        this.compressedSize = document.getElementById('compressedSize');
        this.qualitySlider = document.getElementById('quality');
        this.qualityValue = document.getElementById('qualityValue');
        this.downloadBtn = document.getElementById('downloadBtn');
    }

    setupEventListeners() {
        // 文件选择相关事件
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));

        // 压缩质量调节事件
        this.qualitySlider.addEventListener('input', (e) => {
            this.qualityValue.textContent = `${e.target.value}%`;
            if (this.currentFile) {
                this.compressImage(this.currentFile, e.target.value / 100);
            }
        });

        // 下载按钮事件
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.style.borderColor = '#007AFF';
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.style.borderColor = '#ddd';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('请选择图片文件！');
            return;
        }

        this.currentFile = file;
        this.previewSection.style.display = 'block';
        this.displayOriginalImage(file);
        this.compressImage(file, this.qualitySlider.value / 100);
    }

    displayOriginalImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalPreview.src = e.target.result;
            this.originalSize.textContent = `文件大小: ${this.formatFileSize(file.size)}`;
        };
        reader.readAsDataURL(file);
    }

    async compressImage(file, quality) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 保持原始宽高比
            canvas.width = img.width;
            canvas.height = img.height;

            // 绘制图片
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // 转换为blob
            canvas.toBlob(
                (blob) => {
                    this.compressedPreview.src = URL.createObjectURL(blob);
                    this.compressedSize.textContent = `文件大小: ${this.formatFileSize(blob.size)}`;
                    this.compressedBlob = blob;
                },
                'image/jpeg',
                quality
            );
        };
    }

    downloadImage() {
        if (!this.compressedBlob) return;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(this.compressedBlob);
        link.download = `compressed_${this.currentFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ImageCompressor();
});
    