BEGIN;

  TRUNCATE
    appointments,
    mav_users
    RESTART IDENTITY CASCADE;

  INSERT INTO mav_users
    (id, username, visible_name, password, email, company)
  VALUES
    ('cdadeb7a-e757-4bfe-976a-c451f43400fc', 'dunder', 'Dunder Mifflin', '$2a$12$A83oBRD9MCMdoEwa1fyibu0H2ZDDWj4VwYdclZ0LNso/HmsQqg7Fa', 'dunder@outlook.com', 'dunder mifflin'),
    ('7765ca99-b371-476d-8d4b-2c5b24b5f6d2', 'b.deboop', 'Bodeep Deboop', '$2a$12$T89uQdB5oOSVXxsmMR1ZpuhkchlwfQNm.amxslxLzdO1Wuz0YW8Nm', 'cowboy@bebop.com', null),
    ('67444311-1d29-4e22-abb7-1f889aab9ee3', 'c.bloggs', 'Charlie Bloggs', '$2a$12$71b1t9Dt1/Vju8Iq4QChNuKbRgwm37WvTVtC3OMFU1/xAxgVuSMrG', 'bloggins@gloin.net', 'bloggins'),
    ('0d545b0c-9edf-4152-adfe-a420ecbd598c', 's.smith', 'Sam Smith', '$2a$12$3QTUM29VkzGnKHtpDGA6j.EHoHJnBl5hZp4R8yvbHKyvE1xM6Kxu2', 'generic@email.com', 'generic co'),
    ('b0b53f8e-235a-487b-af57-f670977c4000', 'lexlor', 'Alex Taylor', '$2a$12$BsqqlBw/Op0OmeVWxjcx6uIGizEDxfhFQhfLy/aJ9hPflO7gHuEIu', 'mstaylor86@emails.com', 'that taylor'),
    ('dd6eb98b-f7ab-4966-a8b3-df2c54121056', 'wippy', 'Ping Won In', '$2a$12$wnGPVCm./vyACJjjmMQM6OOhOUyuqaPZBkijl4z0m4yRrBBOfsQJG', 'isthisrascist@prob.com', 'DAGplus');

  INSERT INTO appointments
    (user_id, longitude, latitude, address, title, start_time, end_time, description)
  VALUES
    ('cdadeb7a-e757-4bfe-976a-c451f43400fc', -81.3729264, 28.665953, '285 Windmeadows Street, Altamonte Springs, FL 32701', 'Chevy Movie Theater', '2020-07-26T18:28', '2020-07-26T19:28', 'Interior crocodile alligator'),
    ('7765ca99-b371-476d-8d4b-2c5b24b5f6d2', -81.3537, 28.625579, '137 Shell Point West, Maitland, FL 32751', 'A Shelly Place', '2020-07-26T20:28', '2020-07-26T21:28', 'She sells sea shells'),
    ('cdadeb7a-e757-4bfe-976a-c451f43400fc', -81.407945, 28.632812, 'Circle Community Church, Pembrook Drive, Maitland, FL 32810', 'Circle Community Church', '2020-07-26T15:28', '2020-07-26T16:28', 'A night at the round table'),
    ('7765ca99-b371-476d-8d4b-2c5b24b5f6d2', -81.35473, 28.588807, 'Clarendon Avenue, Winter Park, FL 32789', 'Clarendon', '2020-07-27T13:28', '2020-07-27T15:28', 'Hometown party'),
    ('cdadeb7a-e757-4bfe-976a-c451f43400fc', -81.457384, 28.578557, '5600 Fair Oak Court, Orange County, FL 32808', 'A Fair Court', '2020-07-27T17:28', '2020-07-27T18:28', 'A fair time');

  COMMIT;