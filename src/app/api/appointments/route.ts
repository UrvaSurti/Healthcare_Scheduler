// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import { Appointment } from '../../../models';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';

// Define the path to the appointments.json file
const filePath = path.resolve('./src/data/appointments.json');

// Helper function to get the appointments from the file
async function getAppointments() {
  const appointmentsData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(appointmentsData).appointments;
}

// Helper function to save appointments to the file
async function saveAppointments(appointments: Appointment[]) {
  await fs.writeFile(filePath, JSON.stringify({ appointments }, null, 2));
}

// GET method for fetching appointments
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    const providerId = searchParams.get('providerId');

// GET method for fetching all appointments
    const appointments = await getAppointments();
    let filteredAppointments = appointments;

// GET method for fetching appointments By Email_ID
    if (userEmail) {
      filteredAppointments = filteredAppointments.filter(
        (appointment: Appointment) => appointment.userEmail === userEmail
      );
    }

// GET method for fetching appointments By Providers_ID
    if (providerId) {
      filteredAppointments = filteredAppointments.filter(
        (appointment: Appointment) => appointment.providerId === providerId
      );
    }

    return NextResponse.json(filteredAppointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// POST method for creating a new appointment
export async function POST(req: Request) {
  const { providerId, dateTime, userEmail } = await req.json();

  const newAppointment: Appointment = {
    id: uuidv4(),
    providerId,
    dateTime,
    userEmail,
    reservationCode: uuidv4(),
  };

  try {
    const appointments = await getAppointments();
    appointments.push(newAppointment);
    await saveAppointments(appointments);
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save the appointment' }, { status: 500 });
  }
}

// PUT method for rescheduling an appointment
export async function PUT(req: Request) {
    const { reservationCode, newDateTime } = await req.json();
  
    try {
      const appointments = await getAppointments();
  
      // Check if the appointment with the given reservationCode exists
      const appointmentExists = appointments.some(
        (appointment: Appointment) => appointment.reservationCode === reservationCode
      );
  
      if (!appointmentExists) {
        // If the appointment doesn't exist, return a 404 error
        return NextResponse.json({ error: `Appointment with reservationCode ${reservationCode} not found` }, { status: 404 });
      }
  
      // Update the appointment with the new dateTime
      const updatedAppointments = appointments.map((appointment: Appointment) => {
        if (appointment.reservationCode === reservationCode) {
          return { ...appointment, dateTime: newDateTime };
        }
        return appointment;
      });
  
      // Save the updated appointments back to the file
      await saveAppointments(updatedAppointments);
  
      return NextResponse.json({ message: 'Appointment rescheduled' });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to reschedule the appointment' }, { status: 500 });
    }
  }

// DELETE method for canceling an appointment
export async function DELETE(req: Request) {
  const { reservationCode } = await req.json();

  try {
    const appointments = await getAppointments();
    const updatedAppointments = appointments.filter(
      (appointment: Appointment) => appointment.reservationCode !== reservationCode
    );

    await saveAppointments(updatedAppointments);
    return NextResponse.json({ message: 'Appointment canceled' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel the appointment' }, { status: 500 });
  }
}
