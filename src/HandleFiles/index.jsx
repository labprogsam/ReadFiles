import React, { useState, useEffect } from 'react';
import uploadIcon from '../icons/download.svg';
import readXlsxFile from 'read-excel-file'
import './HandleFiles.scss';

function HandleFiles() {
  const [file, setFile] = useState('');
  const [fileData, setFileData] = useState({});

  useEffect(() => {
    onUpload();
  }, [file])

  const onChange = () => {
    const inputFile = document.querySelector(
      '#file'
    );
    setFile(inputFile.files[0]);
  }

  // Handle Events
  const removeClass = (e) => {
    e.preventDefault();
    e.stopPropagation()
    const el = document.querySelector('.box');
    el.removeAttribute('id');
    setFile(e.dataTransfer.files[0]);
  }

  const addClass = (e) => {
    e.preventDefault();
    e.stopPropagation()
    const el = document.querySelector('.box');
    el.setAttribute('id', 'is-dragover');
   }

   const onUpload = () => {
    if (file) {
      if (file.size / 1024 / 1024 > 18) {
        console.log('O arquivo é muito grande!')
        return;
      }

      // FileReader permite que possamos ler assincronamente o conteudo dos arquivos
      const reader = new FileReader();

      // Método utilizado para ler o content do arquivo.
      reader.readAsDataURL(file);

      // Manipulador de evento que é acionado assim q a operação de leitura é realizada com sucesso.
      reader.onload = (event) => {
        const fileContent = {
            fileName: file.name,
            content: reader.result,
        };
        setFileData(fileContent);
      };

      // Manipulador de evento que é acionado assim q a operação de leitura falha.
      reader.onerror = () => {
        console.log('Houve um erro no envio do arquivo')
      };

      readXlsxFile(file).then((rows) => {
        console.log(rows);
        console.table(rows);
      })
    }
  };

  const onDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', fileData.content);
    element.setAttribute('download', fileData.fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

   const onSubmit = (e) => {
    alert('Submitado')
  }

  return (
    <div className="container">
      <form className="box has-advanced-upload"
      draggable
      onDragOver={(e) => addClass(e)}
      onDragEnter={(e) => addClass(e)}
      onDragLeave={(e) => removeClass(e)}
      onDragEnd={(e) => removeClass(e)}
      onDrop={(e) => removeClass(e)}
      onSubmit={(e) => onSubmit(e)}>
        <div className="box-input">
          <img src={uploadIcon} alt="" />
          <input className="box-file" type="file" onChange={() => onChange()} id="file" />
            <label htmlFor="file">
              {fileData.fileName ? fileData.fileName : (
                <>
                  <strong>Choose a file</strong>
                  <span> or drag it here</span>
                </>
              )}
            </label>
          <button type="submit">
            Upload
          </button>
        </div>
      </form>
      {fileData.content && (
        <button type="button" onClick={(e) => onDownload(e)}>
          Download
        </button>
      )}
    </div>
  );
}

export default HandleFiles;
