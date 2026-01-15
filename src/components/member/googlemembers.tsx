'use client'

import { useState, ChangeEvent, FormEvent } from 'react';

type GoogleMember = {
    id: number;
    useremail: string;
    role: 'member';
    createdate: string;
}

export default function GoogleMembersData() {
    const [gdata, setGdata] = useState<GoogleMember[]>([]);
    const [searchGText, setSearchGText] = useState('');
    const [searchGDate, setSearchGDate] = useState('');
    const [selectedGOption, setSelectedGOption] = useState('userEmail');
    const gOptions = ['UserEmail', 'CreateDate'];

    const handleGTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchGText(e.target.value);
    };
    const handleGDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchGDate(e.target.value);
    };
    const selectGChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedGOption(e.target.value as 'UserEmail' | 'CreateDate');
        setSearchGText("");
    };

    const today = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().split("T")[0];
    };

    const formGoogleSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            let searchGOption = '';
            if (selectedGOption === "CreateDate" && searchGDate) {
                searchGOption = `?createdate=${searchGDate}`;
            }
            else if (searchGText.trim() !== '') {
                searchGOption = `?${selectedGOption}=${encodeURIComponent(searchGText)}`;
            }

            const gRes = await fetch(`/api/googlemembers${searchGOption}`);
            if (!gRes.ok) {
                throw new Error('Failed to fetch Google members');
            }
            const gJsondata: GoogleMember[] = await gRes.json();
            setGdata(gJsondata);
        }
        catch (error) {
            console.error('Error fetching Data', error);
        }
    }

    return (
        <div className='flex flex-col items-center'>
            <h1 className='text-3xl font-bold p-5 mt-20 mb-0'>Google 회원 목록</h1>
            <form onSubmit={formGoogleSubmitHandler}>
                <label>
                    <select id="searchType" value={selectedGOption} onChange={selectGChange} className="border px-2 m-2">
                        {gOptions.map(gOption => (
                            <option key={gOption} value={gOption}>
                                {gOption}
                            </option>
                        ))}
                    </select>
                    {selectedGOption === 'CreateDate'
                        ? <input type='date' value={searchGDate} onChange={handleGDateChange} max={today()} className="border px-2 m-2" />
                        : <input type='text' value={searchGText} onChange={handleGTextChange} placeholder="검색어 입력" className="border px-2 m-2" />
                    }
                </label>
                <button type="submit" className='m-5 bg-gray-200 rounded-lg px-5 py-2.5 text-sm font-bold hover:bg-gray-400 cursor-pointer'>Search</button>
            </form>
            <div>
                <table className='border border-gray-400 border-collapse mx-auto'>
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-2">UserEmail</th>
                            <th className="border border-gray-400 px-2">Role</th>
                            <th className="border border-gray-400 px-2">CreateDate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gdata.map(gmembers => (
                            <tr key={gmembers.id}>
                                <td className="border border-gray-400 px-2">{gmembers.useremail}</td>
                                <td className="border border-gray-400 px-2">{gmembers.role}</td>
                                <td className="border border-gray-400 px-2">{new Date(gmembers.createdate).toLocaleString("ko-KR", { hour12: false, })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}