/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */

/**
 * Function to handle a transaction to create a new medical record and add it to the corresponding patient's medical file.
 * @param {org.ehr.hackathon.CreateMedicalRecord} recordData - Transaction to create a new record.
 * @transaction
 * NOTE : recordData is an object of type CreateMedicalRecord
 */

async function CreateMedicalRecord(recordData) {

		// This function creates a medical record asset taking a transaction object recordData of type CreateMedicalRecord as a parameter
		// and appends the newly created medical record to the concerned patient's medical file (stored on Blockchain).

		return getParticipantRegistry('org.ehr.hackathon.Patient')
				.then(function(patientRegistry) {

						// Patients are identified by patientId.
						// Retrieves patient details with patientId matching those in recordData.
					
						return patientRegistry.get(recordData.patient.patientId).then(function(patient) {
								if(patient.medRec == null) {
										patient.medRec = [];
								}

								// Creates a new instance of a medical record as newMedicalRecord.

								var factory = getFactory();
								var newMedicalRecord = factory.newConcept('org.ehr.hackathon', 'MedicalRecord');

								if (newMedicalRecord.medicine == null) {
										newMedicalRecord.medicine = [];
								}
								if (newMedicalRecord.quantity == null) {
										newMedicalRecord.quantity = [];
								}
								if (newMedicalRecord.files == null) {
										newMedicalRecord.files = [];
								}

								// Generates a recordId using a concatenation of the doctor's and patient's first names and the current date and time. 								

								var newRecordId = recordData.doctor.firstName + '_' + recordData.patient.firstName + '_' + new Date().toLocaleDateString() + '_' + new Date().toLocaleTimeString();

								// Setting data for newMedicalRecord.

								newMedicalRecord.recordId = newRecordId;   
								newMedicalRecord.doctor = recordData.doctor;
								newMedicalRecord.medicine = recordData.medicine;
								newMedicalRecord.quantity = recordData.quantity;
								newMedicalRecord.diagnosis = recordData.diagnosis;
								newMedicalRecord.files = recordData.files;

								// Pushing the newly created newMedicalRecord into the corresponding patient's medical file and updating the patientRegistry.

								patient.medRec.push(newMedicalRecord);
								return patientRegistry.update(patient);
						})
				});
}