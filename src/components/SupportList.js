import React from 'react'

const SupportList = (props) => (
    <div className={props.count < 3 ? "support-list empty-list" : "support-list"}>
        <div className="support-list-item">
            <div className="support-list-attribute">
                Ticket Number
            </div>
            <div className="support-list-attribute">
                Headline
            </div>
            <div className="support-list-attribute">
                Description
            </div>
        </div>
        {
            props.items.map(item => {
                return (
                    <div key={item.TicketId} className="support-list-item">
                        <div className="support-list-attribute">
                            {item.TicketId}
                        </div>
                        <div className="support-list-attribute">
                            {item.Headline || "No Description"}
                        </div>
                        <div className="support-list-attribute">
                            {item.Description || "No Description"}
                        </div>
                    </div>
                )
            })
        }
        {
            props.items.length === 0 && (
                <div className="empty-ticket-list">
                        no tickets have been submitted yet
                </div>
            )
        }
    </div>
)

export default SupportList;