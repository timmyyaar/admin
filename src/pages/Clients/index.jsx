import React, { useEffect, useState } from "react";

import { request } from "../../utils";
import { Louder } from "../../components/Louder";
import AddOrEditClientModal from "./AddOrEditClientModal";
import DeleteClientModal from "./DeleteClientModal";
import OrderInfoRow from "./OrderInfoRow";

import "./style.scss";

function Clients() {
  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const [expandedOrderRows, setExpandedOrderRows] = useState([]);

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

  const toggleOrderRow = (id) => {
    setExpandedOrderRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const downloadClientsEmails = async () => {
    const emails = await request({ url: "clients/emails" });

    const element = document.createElement("a");
    const file = new Blob([emails.join("\n")], {
      type: "text/plain",
    });

    element.href = URL.createObjectURL(file);
    element.download = "clients_emails.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="clients-page mt-4">
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
      <div className="_flex _mb-3 _gap-4 lg:_flex-row _flex-col">
        <div className="_flex _items-center _gap-4">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setIsModalOpened(true)}
          >
            Add new client
          </button>
          <span>Total clients count: {clients.length}</span>
        </div>
        <button
          className="btn btn-sm btn-warning lg:_ml-auto"
          onClick={downloadClientsEmails}
        >
          Download clients emails
        </button>
      </div>
      <div className="overflow-x-auto custom-scroll">
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th className="position-sticky top-0 whitespace-nowrap text-center">
                ID
              </th>
              <th className="position-sticky top-0 whitespace-nowrap text-center">
                👤 Name
              </th>
              <th className="position-sticky top-0 whitespace-nowrap text-center">
                📅 Order date
              </th>
              <th className="position-sticky top-0 whitespace-nowrap text-center">
                ✍🏼 Created
              </th>
              <th className="position-sticky top-0 whitespace-nowrap text-center">
                📍 Address
              </th>
              <th className="position-sticky top-0 whitespace-nowrap text-center">
                📧 Email
              </th>
              <th className="position-sticky top-0 whitespace-nowrap text-center">
                📱 Phone
              </th>
              <th className="position-sticky top-0 whitespace-nowrap text-center">
                📷 Instagram
              </th>
              <th className="position-sticky top-0" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const isExpanded = expandedOrderRows.includes(client.id);
              const tdClassName = `text-center ${
                isExpanded ? "border-bottom-0 table-column-active" : ""
              }`;

              return (
                <>
                  <tr
                    key={client.id}
                    onClick={() => toggleOrderRow(client.id)}
                    className="position-relative table-row-hover"
                    title="Click to see client statistic"
                  >
                    <td className={tdClassName}>{client.id}</td>
                    <td className={tdClassName}>{client.name}</td>
                    <td className={tdClassName}>{client.first_order_date}</td>
                    <td className={tdClassName}>
                      {client.first_order_creation_date}
                    </td>
                    <td className={tdClassName}>{client.address}</td>
                    <td className={tdClassName}>{client.email}</td>
                    <td className={tdClassName}>{client.phone}</td>
                    <td className={tdClassName}>{client.instagram}</td>
                    <td className={`vertical-middle ${tdClassName}`}>
                      <div className="d-flex _gap-3 visible-on-table-row-hover">
                        <button
                          type="button"
                          title="Edit client"
                          className="btn btn-sm btn-primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            setIsModalOpened(true);
                            setEditingClient(client);
                          }}
                        >
                          &#9998;
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(event) => {
                            event.stopPropagation();
                            setDeletingClient(client);
                          }}
                        >
                          &#10005;
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedOrderRows.includes(client.id) && (
                    <OrderInfoRow
                      clientName={client.name}
                      clientPhone={client.phone}
                    />
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clients;
