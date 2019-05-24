import React from 'react'

const SupportList = (props) => (
    <div className="support-list">
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
                    <div key={item.TicketId.S} className="support-list-item">
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
    </div>
)

export default SupportList;