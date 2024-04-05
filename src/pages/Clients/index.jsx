import React, { useEffect, useState } from "react";

import { request } from "../../utils";
import { Louder } from "../../components/Louder";
import AddOrEditClientModal from "./AddOrEditClientModal";
import DeleteClientModal from "./DeleteClientModal";

function Clients() {
  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);

  const getClients = async () => {
    try {
      setIsClientsLoading(true);

      const clientsResponse = await request({ url: "clients" });

      setClients(clientsResponse);
    } finally {
      setIsClientsLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  return (
    <div className="clients-wrapper mt-4">
      <Louder visible={isClientsLoading} />
      {isModalOpened && (
        <AddOrEditClientModal
          editingClient={editingClient}
          onClose={() => {
            setIsModalOpened(false);
            setEditingClient(null);
          }}
          setClients={setClients}
        />
      )}
      {deletingClient && (
        <DeleteClientModal
          deletingClient={deletingClient}
          onClose={() => setDeletingClient(null)}
          setClients={setClients}
        />
      )}
      <button
        className="btn btn-sm btn-primary mb-3"
        onClick={() => setIsModalOpened(true)}
      >
        Add new client
      </button>
      <div className="overflow-x-auto">
        <table className="table table-dark">
          <thead>
            <tr>
              <th className="position-sticky top-0 whitespace-nowrap"><div className="d-flex">👤 Name</div></th>
              <th className="position-sticky top-0 whitespace-nowrap">📅 Order date</th>
              <th className="position-sticky top-0 whitespace-nowrap">✍🏼 Created</th>
              <th className="position-sticky top-0 whitespace-nowrap">📍 Address</th>
              <th className="position-sticky top-0 whitespace-nowrap">📧 Email</th>
              <th className="position-sticky top-0 whitespace-nowrap">📱 Phone</th>
              <th className="position-sticky top-0 whitespace-nowrap">📷 Instagram</th>
              <th className="position-sticky top-0" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.first_order_date}</td>
                <td>{client.first_order_creation_date}</td>
                <td>{client.address}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.instagram}</td>
                <td className="vertical-middle">
                  <div className="d-flex _gap-3 visible-on-table-row-hover">
                    <button
                      type="button"
                      title="Edit client"
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setIsModalOpened(true);
                        setEditingClient(client);
                      }}
                    >
                      &#9998;
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setDeletingClient(client)}
                    >
                      &#10005;
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clients;
