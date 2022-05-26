export const Errors = {
    UNRECOGNIZED_EXCEPTION: 'Nešto nije u redu, pokušajte ponovno kasnije!',
	SESSION_EXPIRED: 'Potrebna ponovna prijava!',
	JSON_PARSE_ERROR: 'Nešto nije u redu, pokušajte ponovno kasnije!',
	BAD_REQUEST: 'Nešto nije u redu, pokušajte ponovno kasnije!',
	BAD_CREDENTIALS: 'Netočno korisničko ime ili lozinka!',
	UNAUTHORIZED: 'Nije dozvoljeno!',
	NON_EXISTING_ORGANIZATION: 'Organizacija ne postoji!',
	NON_EXISTING_CATEGORY: 'Kategorija ne postoji',
	NON_EXISTING_POST: "Objava ne postoji!",
	NON_EXISTING_ORGANIZATION_ROLE: "Uloga organizacije ne postoji!"
}

function getErrorByCode(code) {
    return Errors[code] != null ? Errors[code] : "Nešto nije u redu, pokušajte ponovno kasnije!";
}

export { getErrorByCode }