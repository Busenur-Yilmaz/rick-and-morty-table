import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import App from "./App";

// Axios'u jest ile mock'lama
jest.mock("axios");

describe("App Component", () => {
  test("renders table and filters correctly", async () => {
    const mockData = {
      data: {
        results: [
          { id: 1, name: "Rick Sanchez", gender: "Male", species: "Human", status: "Alive" },
          { id: 2, name: "Morty Smith", gender: "Male", species: "Human", status: "Alive" },
        ],
      },
    };
    axios.get.mockResolvedValueOnce(mockData);

    render(<App />);

    // Yükleniyor metni doğru görünüyor mu?
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // API verileri yüklendiğinde tablo görünüyor mu?
    await waitFor(() => {
      expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
      expect(screen.getByText(/Morty Smith/i)).toBeInTheDocument();
    });
  });

  test("handles API errors gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    render(<App />);

    // Hata mesajı doğru bir şekilde görüntüleniyor mu?
    await waitFor(() => {
      expect(screen.getByText(/An error occurred while fetching data/i)).toBeInTheDocument();
    });
  });

  test("filters data correctly", async () => {
    const mockData = {
      data: {
        results: [
          { id: 1, name: "Rick Sanchez", gender: "Male", species: "Human", status: "Alive" },
          { id: 2, name: "Summer Smith", gender: "Female", species: "Human", status: "Alive" },
        ],
      },
    };
    axios.get.mockResolvedValueOnce(mockData);

    render(<App />);

    // API verileri yüklendiğinde tabloya erişebilir miyiz?
    await waitFor(() => {
      expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
      expect(screen.getByText(/Summer Smith/i)).toBeInTheDocument();
    });

    // Filtreleme işlemi
    fireEvent.change(screen.getByPlaceholderText(/enter filter value/i), {
      target: { value: "Summer" },
    });
    fireEvent.click(screen.getByText(/Apply Filter/i));

    // Filtrelenmiş veri doğru bir şekilde görüntüleniyor mu?
    await waitFor(() => {
      expect(screen.getByText(/Summer Smith/i)).toBeInTheDocument();
      expect(screen.queryByText(/Rick Sanchez/i)).not.toBeInTheDocument();
    });
  });

  test("adjusts page size correctly", async () => {
    const mockData = {
      data: {
        results: [
          { id: 1, name: "Rick Sanchez", gender: "Male", species: "Human", status: "Alive" },
          { id: 2, name: "Morty Smith", gender: "Male", species: "Human", status: "Alive" },
          { id: 3, name: "Summer Smith", gender: "Female", species: "Human", status: "Alive" },
        ],
      },
    };
    axios.get.mockResolvedValueOnce(mockData);

    render(<App />);

    // Sayfa boyutunu değiştirme testi
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/page size/i), { target: { value: "2" } });
    });

    // Sadece ilk iki sonuç görüntüleniyor mu?
    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
    expect(screen.getByText(/Morty Smith/i)).toBeInTheDocument();
    expect(screen.queryByText(/Summer Smith/i)).not.toBeInTheDocument();
  });
});
