import Papa from 'papaparse';

export function exportToCSV(projects, filename = 'nmpb-projects.csv') {
  const data = projects.map(p => ({
    'Project ID': p.id,
    'Title': p.title,
    'Plant': p.plant,
    'Category': p.category,
    'State': p.state,
    'City': p.city,
    'Institution': p.institution,
    'Principal Investigator': p.pi,
    'Fund (INR)': p.fund,
    'Sanction Date': p.sanctionDate,
    'Duration (months)': p.duration,
    'Status': p.status,
    'Year': p.year,
  }));
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}