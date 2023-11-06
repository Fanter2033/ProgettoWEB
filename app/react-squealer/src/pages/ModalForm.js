import React, { useState } from "react";
import ReactConfig from "../config/ReactConfig";

function ModalForm() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    privato: false,
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    //aggiorna uno specifico campo di formData con il nuovo valore, mantenendo intatti gli altri campi del form
    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };

  //TODO: aggiungi toast?
  //TODO: POST /channel

  const createChannel = (e) => {
    //prevent a browser reload/refresh.
    e.preventDefault();

    console.log("Dati del form:", formData);
    handleCloseModal();
    //se i campi sono vuoti apri toast
    if (formData.nome.trim() === "" || formData.tipo.trim() === "") {
      //setShowToast(true);
      //alert("completa");
    } else {
      try {
        //campo: private?

        const data = {
          user: {
            name: formData.nome,
            type: formData.tipo,
            private: formData.privato,
          },
        };

        const url = `${ReactConfig.base_url_requests}/channel`;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(data),
        };

        fetch(url, options)
          .then((res) => {
            console.log(res);
            if (res.ok) {
              //creation ok
              return res.json();
            }
          })
          .then((data) => {
            console.log("Creazione canali went good", data);
          })
          .catch((error) => {
            console.error("Creazione canali failed, error:", error);
          });
      } catch (error) {
        //fail createChannels
        console.error(error);
      }
    }
  };

  return (
    <div>
      <button onClick={handleShowModal}> NUOVO CANALE</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Dati creazione</h2>
            <form>
              <div>
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label>Tipo</label>
                <input
                  type="text"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    name="privato"
                    checked={formData.privato}
                    onChange={handleInputChange}
                  />{" "}
                  Privato?
                </label>
              </div>

              <div>
                <button type="button" onClick={createChannel}>
                  CREA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModalForm;
