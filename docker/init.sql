CREATE TABLE IF NOT EXISTS cdr
(
    id                     serial PRIMARY KEY,
    local_ip_v4            inet                     NOT NULL,
    caller_id_name         varchar,
    caller_id_number       varchar,
    destination_number     varchar                  NOT NULL,
    context                varchar                  NOT NULL,
    start_stamp            timestamp with time zone NOT NULL,
    answer_stamp           timestamp with time zone,
    end_stamp              timestamp with time zone NOT NULL,
    duration               int                      NOT NULL,
    billsec                int                      NOT NULL,
    hangup_cause           varchar                  NOT NULL,
    uuid                   uuid                     NOT NULL,
    bleg_uuid              uuid,
    accountcode            varchar,
    read_codec             varchar,
    write_codec            varchar,
    sip_hangup_disposition varchar,
    ani                    varchar,
    RECORD_STEREO          varchar,
    record_path            varchar,
    record_name            varchar
);