import React from "react";

import ReactConfig from "../config/ReactConfig";
import {useState} from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/LoginForm.css";

function ChannelForm(props) {
    console.log(props);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [formData, setFormData] = useState({
        nome: "",
        tipo: "",
        privato: false,
    });

    //const [selectedOption, setSelectedOption] = useState("");
    const handleInputChange = (e) => {
        const {name, value, checked} = e.target;

        if (name === "privato") {
            // Inverti il valore di formData.privato quando il checkbox viene cliccato
            setFormData({
                ...formData,
                [name]: !checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: checked,
            });

            if (name === "nome" || name === "tipo") {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
        }

        //setSelectedOption(value);
    };

    const notify = () =>
        toast.error("Compila tutti i campi.", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

    const createChannel = (e) => {
        //prevent a browser reload/refresh.
        e.preventDefault();

        //se i campi sono vuoti apri toast
        if (formData.nome === "" || formData.tipo === "") {
            notify();
            //alert("completa");
        } else {
            try {
                handleClose();
                //campo: private?

                const data = {
                    channel: {
                        name: formData.nome,
                        type: formData.tipo,
                        private: formData.privato
                    }
                };

                const url = `${ReactConfig.base_url_requests}/channel`;
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    credentials: 'include',
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
            <Button id="button-channel" onClick={handleShow}>
                NUOVO CANALE
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{textAlign: "center"}}>
                        Crea il tuo canale
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            as={Row}
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Name of Channel :)"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group as={Row} className="mb-4">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                as="select"
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleInputChange}
                            >
                                <option value="">{formData.tipo}</option>
                                <option value="CHANNEL_OFFICIAL">CHANNEL_OFFICIAL</option>
                                <option value="CHANNEL_USERS">CHANNEL_USERS</option>
                                <option value="CHANNEL_HASHTAG">CHANNEL_HASHTAG</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Check
                            inline
                            type="checkbox"
                            name="privato"
                            label="Privato?"
                            checked={formData.privato}
                            onChange={handleInputChange}
                        />
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button id="create-channel" onClick={createChannel}>
                        CREA
                    </Button>
                    <ToastContainer/>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ChannelForm;
