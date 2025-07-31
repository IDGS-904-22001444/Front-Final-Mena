import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, tap, map } from 'rxjs';
import { Provider } from '../interfaces/provider';
import { ProviderCreateRequest } from '../interfaces/provider-create-request';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProviders = (): Observable<Provider[]> =>
    this.http.get<any[]>(`${this.apiUrl}/Providers`).pipe(
      tap(rawProviders => {
        console.log('=== RAW PROVIDERS FROM API ===');
        console.log('Raw data:', rawProviders);
        rawProviders.forEach((p, index) => {
          console.log(`Raw Provider ${index}:`, {
            fullObject: p,
            keys: Object.keys(p),
            possibleIds: {
              id: p.id,
              providerId: p.providerId,
              ProviderId: p.ProviderId,
              ID: p.ID,
              ProviderID: p.ProviderID
            }
          });
        });
      }),
      map(rawProviders => {
        // Normalizar los datos para asegurar que tengan un campo 'id'
        return rawProviders.map(provider => {
          const normalizedProvider: Provider = {
            ...provider,
            id: provider.id || provider.providerId || provider.ProviderId || provider.ID || provider.ProviderID
          };
          console.log('Normalized provider:', normalizedProvider);
          return normalizedProvider;
        });
      })
    );

  createProvider = (provider: ProviderCreateRequest): Observable<{ message: string }> =>
    this.http.post<{ message: string }>(`${this.apiUrl}/Providers`, provider);

  updateProvider = (id: number, provider: ProviderCreateRequest): Observable<{ message: string }> => {
    console.log('Updating provider - ID:', id, 'URL:', `${this.apiUrl}/Providers/${id}`);
    return this.http.put<{ message: string }>(`${this.apiUrl}/Providers/${id}`, provider);
  }

  deleteProvider = (id: number): Observable<{ message: string }> => {
    console.log('Deleting provider - ID:', id, 'URL:', `${this.apiUrl}/Providers/${id}`);
    return this.http.delete<{ message: string }>(`${this.apiUrl}/Providers/${id}`);
  }
}