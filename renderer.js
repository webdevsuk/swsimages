const selectFolderBtn = document.getElementById('select-folder-btn');
const selectFileBtn = document.getElementById('select-file-btn');
const imageContainer = document.getElementById('image-container');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const imagecard = document.querySelector('.image-card');
const modalcontent = document.getElementById('modal-content');


// Function to show the modal
function showModal(imageSrc) {
  modalImage.src = imageSrc;
  imageModal.style.display = 'flex'; // Change to flex to use flex box layout
//   modalImage.style.
  
}

// Function to hide the modal
function hideModal() {
    imageModal.style.display = 'none';
    modalImage.style.removeProperty('transform');
    modalImage.style.removeProperty('top');
    modalImage.style.removeProperty('left');
    scaleFactor = 1 ;
}
async function filelist(folderPath) {
    imageContainer.innerHTML = 'Loading...';
        try {
            const imageFiles = await window.electronAPI.readImageFiles(folderPath);
             imageContainer.innerHTML = '';

            if (imageFiles.length === 0) {
                imageContainer.innerText = "No Images Found in this folder";
                return
            }

            imageFiles.forEach(imageFile => {
                 const imagecard =document.createElement('div');
                 imagecard.classList.add('image-card');
                 imageContainer.appendChild(imagecard);
                 const img = document.createElement('img');
                 img.src = imageFile;
                 img.classList.add('image-item');
                 imagecard.appendChild(img);

                img.addEventListener('click', () => {
                   showModal(imageFile);
                });
            });
        } catch (error) {
            imageContainer.innerText = "Error: Could not load images";
            console.error("Error loading images: ", error)
        }
}

//open File
selectFileBtn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFileDialog();    
    showModal(filePath[0]);
    filelist(filePath[1]);
    // console.log(filePath);
    // console.log(filePath[1]);
});

//open Folder
selectFolderBtn.addEventListener('click', async () => {
    const folderPath = await window.electronAPI.openDirectoryDialog();
    console.log(folderPath);

    if(folderPath) {
        filelist(folderPath);
    }
});

// Event listener for modal close click
window.addEventListener('click', (event) => {
    if (event.target === imageModal) {
        hideModal();
    }
})

// const image = document.getElementById('imageContainer');
const container = document.querySelector('.container');
let scaleFactor = 1;
const zoomSpeed = 0.2;
const minScale = 0.1;
const maxScale = 10;

imageModal.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent browser page scroll
    
    const deltaY = event.deltaY;

    // Calculate the new scale factor
    if (deltaY > 0) {
        scaleFactor -= zoomSpeed; // Scrolling down: zoom out
    } else {
        scaleFactor += zoomSpeed; // Scrolling up: zoom in
    }

    // apply scale limits
    scaleFactor = Math.max(minScale, Math.min(maxScale, scaleFactor));

    // apply the zoom
    modalImage.style.transform = `scale(${scaleFactor})`;
    // container.style.transform = `scale(${scaleFactor})`;
});
$(function() {
    $(".modal-drag").draggable(
        {
            // containment: ".container",
            scroll: false,
           
        }
    );
});

