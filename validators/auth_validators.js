export const UserValidator = async (client, username, email) => {
  const result = await client.query(
    `SELECT username, email FROM users WHERE username = $1 OR email = $2`,
    [username, email],
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  if (row.username === username) return "Username already taken";
  if (row.email === email) return "Email already registered";
};

export const VehicleValidator = async (
  client,
  vehicle_number,
  vehicle_plate_number,
) => {
  const result = await client.query(
    `SELECT vehicle_plate_number FROM vehicles 
     WHERE vehicle_number = $1 OR vehicle_plate_number = $2`,
    [vehicle_number, vehicle_plate_number],
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  if (row.vehicle_plate_number === vehicle_plate_number)
    return "Vehicle plate number already registered";
};

export const DriverValidator = async (client, license_number) => {
  const result = await client.query(
    `SELECT license_number FROM drivers WHERE license_number = $1`,
    [license_number],
  );

  if (result.rows.length > 0) return "Driver license number already registered";
  return null;
};
